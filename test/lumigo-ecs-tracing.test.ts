import './matchers/custom-matchers';
import { App, SecretValue, Stack, StackProps } from 'aws-cdk-lib';
import { SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Cluster, ContainerDefinition, ContainerDependencyCondition, EcrImage, FargateTaskDefinition, TaskDefinition, Volume } from 'aws-cdk-lib/aws-ecs';
import { ApplicationLoadBalancedFargateService, QueueProcessingFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { Lumigo } from '../src';

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

describe('ECS tracing injection', () => {

  function checkInjectionOccurred(taskDefinition: TaskDefinition) {
    const containers: ContainerDefinition[] = (taskDefinition as any).containers;

    expect(containers).toHaveLength(2);

    const volumes = (taskDefinition as any).volumes as Volume[];
    expect(volumes).toHaveLength(1);
    expect(volumes[0].name).toBe('lumigo-injector');
    expect(volumes[0].dockerVolumeConfiguration).toBeUndefined();
    expect(volumes[0].efsVolumeConfiguration).toBeUndefined();

    const lumigoInjectorContainer = containers.find(container => container.containerName === 'lumigo-injector')!;
    expect(lumigoInjectorContainer.imageName).toBe('public.ecr.aws/lumigo/lumigo-autotrace:latest');
    expect(lumigoInjectorContainer.containerDependencies).toHaveLength(0);
    expect(lumigoInjectorContainer.mountPoints).toContainEqual({
      sourceVolume: 'lumigo-injector',
      containerPath: '/target',
      readOnly: false,
    });

    const appContainer = containers.find(container => container.containerName !== 'lumigo-injector')!;
    const environment = (appContainer as any).environment as {[key: string]: string};
    expect(environment.LUMIGO_TRACER_TOKEN).toMatch(/^\$\{Token\[.+\]\}$/);
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

    test('works as intended', () => {
      const app = new App();

      new Lumigo({ lumigoToken: SecretValue.secretsManager('LumigoToken') }).traceEverything(app, {
        traceEcs: true,
      });

      const root = new QueueProcessingFargateServiceStack(app, 'TestService');

      app.synth();

      const serviceConstruct = root.node.children
        .find(construct => construct instanceof QueueProcessingFargateService) as QueueProcessingFargateService;

      checkInjectionOccurred(serviceConstruct.taskDefinition);
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

});
