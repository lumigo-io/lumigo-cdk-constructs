import { App, Duration, SecretValue, Stack } from 'aws-cdk-lib';
import { Schedule } from 'aws-cdk-lib/aws-applicationautoscaling';
import { Cluster, EcrImage, FargateService, FargateTaskDefinition } from 'aws-cdk-lib/aws-ecs';
import { ApplicationLoadBalancedFargateService, ScheduledFargateTask } from 'aws-cdk-lib/aws-ecs-patterns';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Lumigo } from '../src';

describe('When misuing the Lumigo trace* methods passing the wrong construct, should throw understandable errors', () => {

  describe('when invoking "traceEverything" with in input', () => {

    test('a Function', () => {
      const app = new App();
      const stack = new Stack(app, 'test-stack');
      const f = new Function(stack, 'TestFunction', {
        code: Code.fromInline('const foo = "bar"'),
        handler: 'index/foo',
        runtime: Runtime.NODEJS_16_X,
      });

      expect(() => {
        new Lumigo({
          lumigoToken: SecretValue.unsafePlainText('xxx'),
        }).traceEverything(f as any as App);
      }).toThrow('Lumigo.traceEverything needs a App as input; are you maybe looking for Lumigo.traceLambda instead?');
    });

    test('an ECS TaskDefinition', () => {
      const app = new App();
      const stack = new Stack(app, 'test-stack');

      expect(() => {
        new Lumigo({
          lumigoToken: SecretValue.unsafePlainText('xxx'),
        }).traceEverything(new FargateTaskDefinition(stack, 'TestDefinition', {}) as any as App);
      }).toThrow('Lumigo.traceEverything needs a App as input; are you maybe looking for Lumigo.traceEcsTaskDefinition instead?');
    });

    test('an ECS ScheduledTask', () => {
      const app = new App();
      const stack = new Stack(app, 'test-stack');

      const cluster = new Cluster(stack, 'TestCluster', {
        clusterName: 'TestCluster',
      });

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

      const scheduledTask = new ScheduledFargateTask(stack, 'test-task', {
        cluster,
        scheduledFargateTaskDefinitionOptions: {
          taskDefinition,
        },
        schedule: Schedule.rate(Duration.days(1)),
      });

      expect(() => {
        new Lumigo({
          lumigoToken: SecretValue.unsafePlainText('xxx'),
        }).traceEverything(scheduledTask as any as App);
      }).toThrow('Lumigo.traceEverything needs a App as input; are you maybe looking for Lumigo.traceEcsScheduledTask instead?');
    });

    test('an ECS Service', () => {
      const app = new App();
      const stack = new Stack(app, 'test-stack');

      const cluster = new Cluster(stack, 'TestCluster', {
        clusterName: 'TestCluster',
      });

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

      const service = new ApplicationLoadBalancedFargateService(stack, 'TestService', {
        cluster,
        taskDefinition,
      });

      expect(() => {
        new Lumigo({
          lumigoToken: SecretValue.unsafePlainText('xxx'),
        }).traceEverything(service as any as App);
      }).toThrow('Lumigo.traceEverything needs a App as input; are you maybe looking for Lumigo.traceEcsService instead?');
    });

  });

  describe('when invoking "traceLambda" with in input', () => {

    test('a CDK app', () => {
      const app = new App();

      expect(() => {
        new Lumigo({
          lumigoToken: SecretValue.unsafePlainText('xxx'),
        }).traceLambda(app as any as Function);
      }).toThrow('Lumigo.traceLambda needs a Function as input; are you maybe looking for Lumigo.traceEverything instead?');
    });

    test('an ECS TaskDefinition', () => {
      const app = new App();
      const stack = new Stack(app, 'test-stack');

      expect(() => {
        new Lumigo({
          lumigoToken: SecretValue.unsafePlainText('xxx'),
        }).traceLambda(new FargateTaskDefinition(stack, 'TestDefinition', {}) as any as Function);
      }).toThrow('Lumigo.traceLambda needs a Function as input; are you maybe looking for Lumigo.traceEcsTaskDefinition instead?');
    });

    test('an ECS ScheduledTask', () => {
      const app = new App();
      const stack = new Stack(app, 'test-stack');

      const cluster = new Cluster(stack, 'TestCluster', {
        clusterName: 'TestCluster',
      });

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

      const scheduledTask = new ScheduledFargateTask(stack, 'test-task', {
        cluster,
        scheduledFargateTaskDefinitionOptions: {
          taskDefinition,
        },
        schedule: Schedule.rate(Duration.days(1)),
      });

      expect(() => {
        new Lumigo({
          lumigoToken: SecretValue.unsafePlainText('xxx'),
        }).traceLambda(scheduledTask as any as Function);
      }).toThrow('Lumigo.traceLambda needs a Function as input; are you maybe looking for Lumigo.traceEcsScheduledTask instead?');
    });

    test('an ECS Service', () => {
      const app = new App();
      const stack = new Stack(app, 'test-stack');

      const cluster = new Cluster(stack, 'TestCluster', {
        clusterName: 'TestCluster',
      });

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

      const service = new ApplicationLoadBalancedFargateService(stack, 'TestService', {
        cluster,
        taskDefinition,
      });

      expect(() => {
        new Lumigo({
          lumigoToken: SecretValue.unsafePlainText('xxx'),
        }).traceLambda(service as any as Function);
      }).toThrow('Lumigo.traceLambda needs a Function as input; are you maybe looking for Lumigo.traceEcsService instead?');
    });

  });

  describe('when invoking "traceEcsTaskDefinition" with in input', () => {

    test('a CDK app', () => {
      const app = new App();

      expect(() => {
        new Lumigo({
          lumigoToken: SecretValue.unsafePlainText('xxx'),
        }).traceEcsTaskDefinition(app as any as FargateTaskDefinition);
      }).toThrow('Lumigo.traceEcsTaskDefinition needs a TaskDefinition as input; are you maybe looking for Lumigo.traceEverything instead?');
    });

    test('a Function', () => {
      const app = new App();
      const stack = new Stack(app, 'test-stack');
      const f = new Function(stack, 'TestFunction', {
        code: Code.fromInline('const foo = "bar"'),
        handler: 'index/foo',
        runtime: Runtime.NODEJS_16_X,
      });

      expect(() => {
        new Lumigo({
          lumigoToken: SecretValue.unsafePlainText('xxx'),
        }).traceEcsTaskDefinition(f as any as FargateTaskDefinition);
      }).toThrow('Lumigo.traceEcsTaskDefinition needs a TaskDefinition as input; are you maybe looking for Lumigo.traceLambda instead?');
    });

    test('an ECS ScheduledTask', () => {
      const app = new App();
      const stack = new Stack(app, 'test-stack');

      const cluster = new Cluster(stack, 'TestCluster', {
        clusterName: 'TestCluster',
      });

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

      const scheduledTask = new ScheduledFargateTask(stack, 'test-task', {
        cluster,
        scheduledFargateTaskDefinitionOptions: {
          taskDefinition,
        },
        schedule: Schedule.rate(Duration.days(1)),
      });

      expect(() => {
        new Lumigo({
          lumigoToken: SecretValue.unsafePlainText('xxx'),
        }).traceEcsTaskDefinition(scheduledTask as any as FargateTaskDefinition);
      }).toThrow('Lumigo.traceEcsTaskDefinition needs a TaskDefinition as input; are you maybe looking for Lumigo.traceEcsScheduledTask instead?');
    });

    test('an ECS Service', () => {
      const app = new App();
      const stack = new Stack(app, 'test-stack');

      const cluster = new Cluster(stack, 'TestCluster', {
        clusterName: 'TestCluster',
      });

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

      const service = new ApplicationLoadBalancedFargateService(stack, 'TestService', {
        cluster,
        taskDefinition,
      });

      expect(() => {
        new Lumigo({
          lumigoToken: SecretValue.unsafePlainText('xxx'),
        }).traceEcsTaskDefinition(service as any as FargateTaskDefinition);
      }).toThrow('Lumigo.traceEcsTaskDefinition needs a TaskDefinition as input; are you maybe looking for Lumigo.traceEcsService instead?');
    });

  });

  describe('when invoking "traceEcsScheduledTask" with in input', () => {

    test('a CDK app', () => {
      const app = new App();

      expect(() => {
        new Lumigo({
          lumigoToken: SecretValue.unsafePlainText('xxx'),
        }).traceEcsScheduledTask(app as any as ScheduledFargateTask);
      }).toThrow('Lumigo.traceEcsScheduledTask needs a ScheduledEc2Task or ScheduledFargateTask as input; are you maybe looking for Lumigo.traceEverything instead?');
    });

    test('a Function', () => {
      const app = new App();
      const stack = new Stack(app, 'test-stack');
      const f = new Function(stack, 'TestFunction', {
        code: Code.fromInline('const foo = "bar"'),
        handler: 'index/foo',
        runtime: Runtime.NODEJS_16_X,
      });

      expect(() => {
        new Lumigo({
          lumigoToken: SecretValue.unsafePlainText('xxx'),
        }).traceEcsScheduledTask(f as any as ScheduledFargateTask);
      }).toThrow('Lumigo.traceEcsScheduledTask needs a ScheduledEc2Task or ScheduledFargateTask as input; are you maybe looking for Lumigo.traceLambda instead?');
    });

    test('an ECS TaskDefinition', () => {
      const app = new App();
      const stack = new Stack(app, 'test-stack');

      expect(() => {
        new Lumigo({
          lumigoToken: SecretValue.unsafePlainText('xxx'),
        }).traceEcsScheduledTask(new FargateTaskDefinition(stack, 'TestDefinition', {}) as any as ScheduledFargateTask);
      }).toThrow('Lumigo.traceEcsScheduledTask needs a ScheduledEc2Task or ScheduledFargateTask as input; are you maybe looking for Lumigo.traceEcsTaskDefinition instead?');
    });

    test('an ECS Service', () => {
      const app = new App();
      const stack = new Stack(app, 'test-stack');

      const cluster = new Cluster(stack, 'TestCluster', {
        clusterName: 'TestCluster',
      });

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

      const service = new ApplicationLoadBalancedFargateService(stack, 'TestService', {
        cluster,
        taskDefinition,
      });

      expect(() => {
        new Lumigo({
          lumigoToken: SecretValue.unsafePlainText('xxx'),
        }).traceEcsScheduledTask(service as any as ScheduledFargateTask);
      }).toThrow('Lumigo.traceEcsScheduledTask needs a ScheduledEc2Task or ScheduledFargateTask as input; are you maybe looking for Lumigo.traceEcsService instead?');
    });

  });

  describe('when invoking "traceEcsService" with in input', () => {

    test('a CDK app', () => {
      const app = new App();

      expect(() => {
        new Lumigo({
          lumigoToken: SecretValue.unsafePlainText('xxx'),
        }).traceEcsService(app as any as FargateService);
      }).toThrow('Lumigo.traceEcsService needs a EcsService as input; are you maybe looking for Lumigo.traceEverything instead?');
    });

    test('a Function', () => {
      const app = new App();
      const stack = new Stack(app, 'test-stack');
      const f = new Function(stack, 'TestFunction', {
        code: Code.fromInline('const foo = "bar"'),
        handler: 'index/foo',
        runtime: Runtime.NODEJS_16_X,
      });

      expect(() => {
        new Lumigo({
          lumigoToken: SecretValue.unsafePlainText('xxx'),
        }).traceEcsService(f as any as FargateService);
      }).toThrow('Lumigo.traceEcsService needs a EcsService as input; are you maybe looking for Lumigo.traceLambda instead?');
    });

    test('an ECS TaskDefinition', () => {
      const app = new App();
      const stack = new Stack(app, 'test-stack');

      expect(() => {
        new Lumigo({
          lumigoToken: SecretValue.unsafePlainText('xxx'),
        }).traceEcsService(new FargateTaskDefinition(stack, 'TestDefinition', {}) as any as FargateService);
      }).toThrow('Lumigo.traceEcsService needs a EcsService as input; are you maybe looking for Lumigo.traceEcsTaskDefinition instead?');
    });

    test('an ECS ScheduledTask', () => {
      const app = new App();
      const stack = new Stack(app, 'test-stack');

      const cluster = new Cluster(stack, 'TestCluster', {
        clusterName: 'TestCluster',
      });

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

      const scheduledTask = new ScheduledFargateTask(stack, 'test-task', {
        cluster,
        scheduledFargateTaskDefinitionOptions: {
          taskDefinition,
        },
        schedule: Schedule.rate(Duration.days(1)),
      });

      expect(() => {
        new Lumigo({
          lumigoToken: SecretValue.unsafePlainText('xxx'),
        }).traceEcsService(scheduledTask as any as FargateService);
      }).toThrow('Lumigo.traceEcsService needs a EcsService as input; are you maybe looking for Lumigo.traceEcsScheduledTask instead?');
    });

  });

});