import './matchers/custom-matchers';
import { App, SecretValue, Stack, StackProps } from 'aws-cdk-lib';
import { SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { CfnTaskDefinition, Cluster, ContainerDefinition, ContainerDependencyCondition, EcrImage, FargateTaskDefinition, TaskDefinition, Volume } from 'aws-cdk-lib/aws-ecs';
import { ApplicationLoadBalancedFargateService, QueueProcessingFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { Lumigo, DEFAULT_LUMIGO_INJECTOR_IMAGE_NAME } from '../src';

class ApplicationLoadBalancedFargateServiceStack extends Stack {

  readonly taskDefinition: TaskDefinition;

  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const vpc = new Vpc(this, 'TestVpc', {
      vpcName: 'TestVpc',
      cidr: '10.0.0.0/16',
      maxAzs: 3, // Default is all AZs in region
      natGateways: 1,
      subnetConfiguration: [
        {
          name: 'private-subnet',
          subnetType: SubnetType.PRIVATE_WITH_NAT,
          cidrMask: 24,
        },
        {
          name: 'public-subnet',
          subnetType: SubnetType.PUBLIC,
          cidrMask: 24,
        },
      ],
    });

    const cluster = new Cluster(this, 'TestCluster', {
      clusterName: 'TestCluster',
      vpc,
    });

    this.taskDefinition = new FargateTaskDefinition(this, 'TestDefinition', {});
    this.taskDefinition.addContainer('app', {
      image: EcrImage.fromRegistry('docker.io/library/hello-world', {}),
      environment: {
        OTEL_SERVICE_NAME: 'http-server', // This will be the service name in Lumigo
        LUMIGO_DEBUG_SPANDUMP: '/dev/stdout',
      },
      portMappings: [{
        containerPort: 8443,
      }],
    });

    new ApplicationLoadBalancedFargateService(this, 'TestService', {
      cluster,
      taskDefinition: this.taskDefinition,
    });
  }

}

class QueueProcessingFargateServiceStack extends Stack {

  readonly taskDefinition: TaskDefinition;

  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const vpc = new Vpc(this, 'TestVpc', {
      vpcName: 'TestVpc',
      cidr: '10.0.0.0/16',
      maxAzs: 3, // Default is all AZs in region
      natGateways: 1,
      subnetConfiguration: [
        {
          name: 'private-subnet',
          subnetType: SubnetType.PRIVATE_WITH_NAT,
          cidrMask: 24,
        },
        {
          name: 'public-subnet',
          subnetType: SubnetType.PUBLIC,
          cidrMask: 24,
        },
      ],
    });

    const cluster = new Cluster(this, 'TestCluster', {
      clusterName: 'TestCluster',
      vpc,
    });

    const queue = new Queue(this, 'TestQueue');

    const service = new QueueProcessingFargateService(this, 'TestService', {
      cluster,
      image: EcrImage.fromRegistry('docker.io/library/hello-world', {}),
      environment: {
        OTEL_SERVICE_NAME: 'http-server', // This will be the service name in Lumigo
        LUMIGO_DEBUG_SPANDUMP: '/dev/stdout',
      },
      queue,
      healthCheck: {
        command: ['CMD-SHELL', 'pgrep python3'], // Check that the process is still running
      },
    });

    this.taskDefinition = service.taskDefinition;
  }

};

class CheckInjectionOptions {
  expectedContainerImage?: string = DEFAULT_LUMIGO_INJECTOR_IMAGE_NAME;
  expectedSecretSuffix?: string = '';
}

describe('ECS tracing injection', () => {

  function checkInjectionOccurred(taskDefinition: TaskDefinition, options: CheckInjectionOptions = {}) {
    const containers: ContainerDefinition[] = (taskDefinition as any).containers;

    expect(containers).toHaveLength(2);

    const volumes = (taskDefinition as any).volumes as Volume[];
    expect(volumes).toHaveLength(1);
    expect(volumes[0].name).toBe('lumigo-injector');
    expect(volumes[0].dockerVolumeConfiguration).toBeUndefined();
    expect(volumes[0].efsVolumeConfiguration).toBeUndefined();

    const lumigoInjectorContainer = containers.find(container => container.containerName === 'lumigo-injector')!;
    expect(lumigoInjectorContainer.imageName).toBe(options.expectedContainerImage || DEFAULT_LUMIGO_INJECTOR_IMAGE_NAME);
    expect(lumigoInjectorContainer.containerDependencies).toHaveLength(0);
    expect(lumigoInjectorContainer.mountPoints).toContainEqual({
      sourceVolume: 'lumigo-injector',
      containerPath: '/target',
      readOnly: false,
    });

    const appContainer = containers.find(container => container.containerName !== 'lumigo-injector')!;
    const environment = (appContainer as any).environment as {[key: string]: string};
    const secrets = (appContainer as any).secrets as CfnTaskDefinition.SecretProperty[];
    expect(secrets).toHaveLength(1); // No duplicate LUMIGO_TRACER_TOKEN entries

    if (!!options.expectedSecretSuffix) {
      expect(secrets[0]).toMatchObject({
        name: 'LUMIGO_TRACER_TOKEN',
        valueFrom: expect.stringMatching(`arn:.*:${options.expectedSecretSuffix}`),
      });
    } else {
      expect(secrets[0]).toHaveProperty('name', 'LUMIGO_TRACER_TOKEN');
    }
    expect(environment.LD_PRELOAD).toBe('/opt/lumigo/injector/lumigo_injector.so');

    expect(appContainer.mountPoints).toContainEqual({
      sourceVolume: 'lumigo-injector',
      containerPath: '/opt/lumigo',
      readOnly: true,
    });

    expect(appContainer.containerDependencies!).toHaveLength(1);
    const containerDependency = appContainer.containerDependencies![0]!;
    expect(containerDependency.condition).toBe(ContainerDependencyCondition.COMPLETE);
    expect(containerDependency.container).toBe(lumigoInjectorContainer);
  }

  describe('with a QueueProcessingFargateService', () => {

    test('works with the Lumigo Token specified as SecretManager secret', () => {
      const app = new App();

      new Lumigo({ lumigoToken: SecretValue.secretsManager('LumigoToken') }).traceEverything(app, {
        traceEcs: true,
      });

      const root = new QueueProcessingFargateServiceStack(app, 'TestService');

      app.synth();

      const serviceConstruct = root.node.children
        .find(construct => construct instanceof QueueProcessingFargateService) as QueueProcessingFargateService;

      checkInjectionOccurred(serviceConstruct.taskDefinition, {
        expectedSecretSuffix: 'secret:LumigoToken',
      });
    });

    test('works with the Lumigo Token specified as SSM parameter with version', () => {
      const app = new App();

      new Lumigo({ lumigoToken: SecretValue.ssmSecure('LumigoToken', '42') }).traceEverything(app);

      const root = new QueueProcessingFargateServiceStack(app, 'TestService');

      app.synth();

      const serviceConstruct = root.node.children
        .find(construct => construct instanceof QueueProcessingFargateService) as QueueProcessingFargateService;

      checkInjectionOccurred(serviceConstruct.taskDefinition, {
        /*
         * TODO Update test when support for versions in SSM params is available in AWS
         * https://github.com/aws/aws-cdk/issues/8405
         */
        expectedSecretSuffix: 'parameter/LumigoToken',
      });
    });

    test('works with the Lumigo Token specified as SSM parameter without version', () => {
      const app = new App();

      new Lumigo({ lumigoToken: SecretValue.ssmSecure('LumigoToken') }).traceEverything(app, {
        traceEcs: true,
      });

      const root = new QueueProcessingFargateServiceStack(app, 'TestService');

      app.synth();

      const serviceConstruct = root.node.children
        .find(construct => construct instanceof QueueProcessingFargateService) as QueueProcessingFargateService;

      checkInjectionOccurred(serviceConstruct.taskDefinition, {
        expectedSecretSuffix: 'parameter/LumigoToken',
      });
    });

    test('supports overriding the container image', () => {
      const app = new App();

      const expectedContainerImage = 'public.ecr.aws/lumigo/lumigo-autotrace:v1';
      const root = new QueueProcessingFargateServiceStack(app, 'TestService');

      const lumigo = new Lumigo({ lumigoToken: SecretValue.secretsManager('LumigoToken') });
      lumigo.traceEverything(app, {
        traceEcs: true,
        lumigoAutoTraceImage: expectedContainerImage,
      });

      app.synth();

      checkInjectionOccurred(root.taskDefinition, {
        expectedContainerImage,
      });
    });

    test('is idempotent', () => {
      const app = new App();

      const root = new QueueProcessingFargateServiceStack(app, 'TestService');

      const lumigo = new Lumigo({ lumigoToken: SecretValue.secretsManager('LumigoToken') });
      lumigo.traceEverything(app, {
        traceEcs: true,
      });
      lumigo.traceEcsTaskDefinition(root.taskDefinition);

      app.synth();

      checkInjectionOccurred(root.taskDefinition);
    });

    test('applies the Lumigo tag', () => {
      const app = new App();

      const root = new QueueProcessingFargateServiceStack(app, 'TestService');

      const lumigo = new Lumigo({ lumigoToken: SecretValue.secretsManager('LumigoToken') });
      lumigo.traceEverything(app, {
        traceEcs: true,
        lumigoTag: 'TEST',
      });
      lumigo.traceEcsTaskDefinition(root.taskDefinition);

      app.synth();

      checkInjectionOccurred(root.taskDefinition);

      expect(root).toHaveAwsTag('LUMIGO_TAG', 'TEST');
      expect(root.taskDefinition).not.toHaveAwsTag('LUMIGO_TAG', 'TEST');
    });

  });

  describe('with a ApplicationLoadBalancedFargateService', () => {

    test('works as intended', () => {
      const app = new App();

      new Lumigo({ lumigoToken: SecretValue.secretsManager('LumigoToken') }).traceEverything(app, {
        traceEcs: true,
      });

      const root = new ApplicationLoadBalancedFargateServiceStack(app, 'TestService');

      app.synth();

      checkInjectionOccurred(root.taskDefinition);
    });

    test('supports overriding the container image', () => {
      const app = new App();

      const expectedContainerImage = 'public.ecr.aws/lumigo/lumigo-autotrace:v1';
      new Lumigo({ lumigoToken: SecretValue.secretsManager('LumigoToken') }).traceEverything(app, {
        traceEcs: true,
        lumigoAutoTraceImage: expectedContainerImage,
      });

      const root = new ApplicationLoadBalancedFargateServiceStack(app, 'TestService');

      app.synth();

      checkInjectionOccurred(root.taskDefinition, {
        expectedContainerImage,
      });
    });

    test('is idempotent', () => {
      const app = new App();

      const root = new ApplicationLoadBalancedFargateServiceStack(app, 'TestService');

      const lumigo = new Lumigo({ lumigoToken: SecretValue.secretsManager('LumigoToken') });
      lumigo.traceEverything(app, {
        traceEcs: true,
      });
      lumigo.traceEcsTaskDefinition(root.taskDefinition);

      app.synth();

      checkInjectionOccurred(root.taskDefinition);
    });

  });

  describe('with a TaskDefinition', () => {

    test('works as intended', () => {
      const app = new App();

      new Lumigo({ lumigoToken: SecretValue.secretsManager('LumigoToken') }).traceEverything(app, {
        traceEcs: true,
      });

      const stack = new Stack(app, 'TestStack');

      const taskDefinition = new FargateTaskDefinition(stack, 'TestDefinition', {});
      taskDefinition.addContainer('app', {
        image: EcrImage.fromRegistry('docker.io/library/hello-world', {}),
        environment: {
          OTEL_SERVICE_NAME: 'http-server', // This will be the service name in Lumigo
          LUMIGO_DEBUG_SPANDUMP: '/dev/stdout',
        },
        portMappings: [{
          containerPort: 8443,
        }],
      });

      app.synth();

      checkInjectionOccurred(taskDefinition);
    });

    test('supports overriding the container image', () => {
      const app = new App();

      const expectedContainerImage = 'public.ecr.aws/lumigo/lumigo-autotrace:v1';
      new Lumigo({ lumigoToken: SecretValue.secretsManager('LumigoToken') }).traceEverything(app, {
        traceEcs: true,
        lumigoAutoTraceImage: expectedContainerImage,
      });

      const stack = new Stack(app, 'TestStack');

      const taskDefinition = new FargateTaskDefinition(stack, 'TestDefinition', {});
      taskDefinition.addContainer('app', {
        image: EcrImage.fromRegistry('docker.io/library/hello-world', {}),
        environment: {
          OTEL_SERVICE_NAME: 'http-server', // This will be the service name in Lumigo
          LUMIGO_DEBUG_SPANDUMP: '/dev/stdout',
        },
        portMappings: [{
          containerPort: 8443,
        }],
      });

      app.synth();

      checkInjectionOccurred(taskDefinition, {
        expectedContainerImage,
      });
    });

    test('is idempotent', () => {
      const app = new App();

      const lumigo = new Lumigo({ lumigoToken: SecretValue.secretsManager('LumigoToken') });
      lumigo.traceEverything(app, {
        traceEcs: true,
      });

      const stack = new Stack(app, 'TestStack');

      const taskDefinition = new FargateTaskDefinition(stack, 'TestDefinition', {});
      taskDefinition.addContainer('app', {
        image: EcrImage.fromRegistry('docker.io/library/hello-world', {}),
        environment: {
          OTEL_SERVICE_NAME: 'http-server', // This will be the service name in Lumigo
          LUMIGO_DEBUG_SPANDUMP: '/dev/stdout',
        },
        portMappings: [{
          containerPort: 8443,
        }],
      });

      lumigo.traceEcsTaskDefinition(taskDefinition);

      app.synth();

      checkInjectionOccurred(taskDefinition);
    });

  });

  test('applies the Lumigo tag', () => {
    const app = new App();

    const lumigo = new Lumigo({ lumigoToken: SecretValue.secretsManager('LumigoToken') });

    const stack = new Stack(app, 'TestStack');

    const taskDefinition = new FargateTaskDefinition(stack, 'TestDefinition', {});
    taskDefinition.addContainer('app', {
      image: EcrImage.fromRegistry('docker.io/library/hello-world', {}),
      environment: {
        OTEL_SERVICE_NAME: 'http-server', // This will be the service name in Lumigo
        LUMIGO_DEBUG_SPANDUMP: '/dev/stdout',
      },
      portMappings: [{
        containerPort: 8443,
      }],
    });

    lumigo.traceEcsTaskDefinition(taskDefinition, {
      lumigoTag: 'TEST',
    });

    app.synth();

    checkInjectionOccurred(taskDefinition);

    expect(stack).not.toHaveAwsTag('LUMIGO_TAG', 'TEST');
    expect(taskDefinition).toHaveAwsTag('LUMIGO_TAG', 'TEST');
  });

});
