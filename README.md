# Lumigo CDK Integrations

This repository provides means of adding Lumigo tracing as "infrastructure-as-code" to Lambda functions deployed via the [AWS Cloud Development Kit (CDK) v2](https://docs.aws.amazon.com/cdk/api/v2/).

If instead of the AWS CDK v2, you are using the [Serverless Framework](https://www.serverless.com/), refer to the [`serverless-lumigo` plugin](https://github.com/lumigo-io/serverless-lumigo-plugin) documentation.

## Installation

### TypeScript / JavaScript

With `yarn`:

```sh
yarn install '@lumigo/cdk-constructs-v2'
```

With `npm`:

```sh
npm install '@lumigo/cdk-constructs-v2'
```

### Supported Constructs

#### Supported AWS Lambda Constructs

The Lumigo CDK integration applies automated distributed tracing to the following constructs that manage AWS Lambda functions:

| AWS CDK Package | Constructs | Notes |
|-----------------|------------|-------|
| [`aws-cdk-lib/aws-lambda`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda-readme.html) | [`Function`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda.Function.html) | |
| [`aws-cdk-lib/aws-lambda-nodejs`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_nodejs-readme.html) | [`NodejsFunction`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_nodejs.NodejsFunction.html) | |
| [`@aws-cdk/aws-lambda-python-alpha`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-lambda-python-alpha-readme.html) | [`PythonFunction`](https://docs.aws.amazon.com/cdk/api/v2/docs/@aws-cdk_aws-lambda-python-alpha.PythonFunction.html) | The `PythonFunction` is not GA in AWS CDK 2, but is supported by the Lumigo CDK integration regardless |

#### Supported Amazon ECS Constructs

**Note:** The automatic instrumentation of Amazon ECS workloads is currently **experimental**.

The Lumigo CDK integration applies automated distributed tracing to the following constructs that manage Amazon ECS workloads:

| AWS CDK Package | Constructs | Notes |
|-----------------|------------|-------|
| [`aws-cdk-lib/aws-ecs`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs-readme.html) | [`Ec2Service`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs.Ec2Service.html) | Experimental [Node.js](https://github.com/lumigo-io/opentelemetry-js-distro#supported-packages) and [Python](https://github.com/lumigo-io/opentelemetry-python-distro#supported-packages) distributed tracing |
| [`aws-cdk-lib/aws-ecs`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs-readme.html) | [`Ec2TaskDefinition`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs.Ec2TaskDefinition.html) | Experimental [Node.js](https://github.com/lumigo-io/opentelemetry-js-distro#supported-packages) and [Python](https://github.com/lumigo-io/opentelemetry-python-distro#supported-packages) distributed tracing |
| [`aws-cdk-lib/aws-ecs`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs-readme.html) | [`FargateService`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs.FargateService.html) | Experimental [Node.js](https://github.com/lumigo-io/opentelemetry-js-distro#supported-packages) and [Python](https://github.com/lumigo-io/opentelemetry-python-distro#supported-packages) distributed tracing |
| [`aws-cdk-lib/aws-ecs`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs-readme.html) | [`FargateTaskDefinition`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs.FargateTaskDefinition.html) | Experimental [Node.js](https://github.com/lumigo-io/opentelemetry-js-distro#supported-packages) and [Python](https://github.com/lumigo-io/opentelemetry-python-distro#supported-packages) distributed tracing |
| [`aws-cdk-lib/aws-ecs-patterns`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns-readme.html) | [`ApplicationLoadBalancedEc2Service`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns.ApplicationLoadBalancedEc2Service.html) | Experimental [Node.js](https://github.com/lumigo-io/opentelemetry-js-distro#supported-packages) and [Python](https://github.com/lumigo-io/opentelemetry-python-distro#supported-packages) distributed tracing |
| [`aws-cdk-lib/aws-ecs-patterns`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns-readme.html) | [`ApplicationLoadBalancedFargateService`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns.ApplicationLoadBalancedFargateService.html) | Experimental [Node.js](https://github.com/lumigo-io/opentelemetry-js-distro#supported-packages) and [Python](https://github.com/lumigo-io/opentelemetry-python-distro#supported-packages) distributed tracing |
| [`aws-cdk-lib/aws-ecs-patterns`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns-readme.html) | [`ApplicationMultipleTargetGroupsEc2Service`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns.ApplicationMultipleTargetGroupsEc2Service.html) | Experimental [Node.js](https://github.com/lumigo-io/opentelemetry-js-distro#supported-packages) and [Python](https://github.com/lumigo-io/opentelemetry-python-distro#supported-packages) distributed tracing |
| [`aws-cdk-lib/aws-ecs-patterns`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns-readme.html) | [`ApplicationMultipleTargetGroupsFargateService`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns.ApplicationMultipleTargetGroupsFargateService.html) | Experimental [Node.js](https://github.com/lumigo-io/opentelemetry-js-distro#supported-packages) and [Python](https://github.com/lumigo-io/opentelemetry-python-distro#supported-packages) distributed tracing |
| [`aws-cdk-lib/aws-ecs-patterns`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns-readme.html) | [`NetworkLoadBalancedEc2Service`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns.NetworkLoadBalancedEc2Service.html) | Experimental [Node.js](https://github.com/lumigo-io/opentelemetry-js-distro#supported-packages) and [Python](https://github.com/lumigo-io/opentelemetry-python-distro#supported-packages) distributed tracing |
| [`aws-cdk-lib/aws-ecs-patterns`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns-readme.html) | [`NetworkLoadBalancedFargateService`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns.NetworkLoadBalancedFargateService.html) | Experimental [Node.js](https://github.com/lumigo-io/opentelemetry-js-distro#supported-packages) and [Python](https://github.com/lumigo-io/opentelemetry-python-distro#supported-packages) distributed tracing |
| [`aws-cdk-lib/aws-ecs-patterns`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns-readme.html) | [`NetworkMultipleTargetGroupsEc2Service`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns.NetworkMultipleTargetGroupsEc2Service.html) | Experimental [Node.js](https://github.com/lumigo-io/opentelemetry-js-distro#supported-packages) and [Python](https://github.com/lumigo-io/opentelemetry-python-distro#supported-packages) distributed tracing |
| [`aws-cdk-lib/aws-ecs-patterns`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns-readme.html) | [`NetworkMultipleTargetGroupsFargateService`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns.NetworkMultipleTargetGroupsFargateService.html) | Experimental [Node.js](https://github.com/lumigo-io/opentelemetry-js-distro#supported-packages) and [Python](https://github.com/lumigo-io/opentelemetry-python-distro#supported-packages) distributed tracing |
| [`aws-cdk-lib/aws-ecs-patterns`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns-readme.html) | [`QueueProcessingEc2Service`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns.QueueProcessingEc2Service.html) | Experimental [Node.js](https://github.com/lumigo-io/opentelemetry-js-distro#supported-packages) and [Python](https://github.com/lumigo-io/opentelemetry-python-distro#supported-packages) distributed tracing |
| [`aws-cdk-lib/aws-ecs-patterns`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns-readme.html) | [`QueueProcessingFargateService`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns.QueueProcessingFargateService.html) | Experimental [Node.js](https://github.com/lumigo-io/opentelemetry-js-distro#supported-packages) and [Python](https://github.com/lumigo-io/opentelemetry-python-distro#supported-packages) distributed tracing |
| [`aws-cdk-lib/aws-ecs-patterns`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns-readme.html) | [`ScheduledEc2Task`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns.ScheduledEc2Task.html) | Experimental [Node.js](https://github.com/lumigo-io/opentelemetry-js-distro#supported-packages) and [Python](https://github.com/lumigo-io/opentelemetry-python-distro#supported-packages) distributed tracing |
| [`aws-cdk-lib/aws-ecs-patterns`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns-readme.html) | [`ScheduledFargateTask`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns.ScheduledFargateTask.html) | Experimental [Node.js](https://github.com/lumigo-io/opentelemetry-js-distro#supported-packages) and [Python](https://github.com/lumigo-io/opentelemetry-python-distro#supported-packages) distributed tracing |

The automated distributed tracing will work for all Node.js and Python processes [dynamically linked](https://stackoverflow.com/questions/311882/what-do-statically-linked-and-dynamically-linked-mean) against [GNU C Library](https://www.gnu.org/software/libc/) (which is used by virtually all container base images except [Alpine Linux](https://www.alpinelinux.org/)) or [musl libc](https://musl.libc.org/) (for [Alpine Linux](https://www.alpinelinux.org/)-based containers).

## Usage

The Lumigo CDK integration enables you to trace all the applicable constructs inside an CDK App or a Stack, as well on a function-by-function basis.
The only requirement to use the Lumigo CDK integration is to have the [Lumigo token](https://docs.lumigo.io/docs/lumigo-tokens) stored in a way that can be accessed as a [`SecretValue`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.SecretValue.html), which supports, among other means of accessing secrets via the CDK:

* [AWS Secrets Manager](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.SecretValue.html#static-secretswbrmanagersecretid-options)
* [AWS Systems Manager (SSM) parameters](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.SecretValue.html#static-ssmwbrsecureparametername-version)

### Instrumenting the entire CDK application

The following code will apply Lumigo autotracing to all the [supported AWS Lambda constructs](#supported-constructs):

```typescript
import { Lumigo } from '@lumigo/cdk-constructs-v2';
import { App, SecretValue } from 'aws-cdk-lib';

const app = new App();

// Add here stacks and constructs

new Lumigo({lumigoToken:SecretValue.secretsManager('LumigoToken')}).traceEverything(app); // This will trace all Lambda functions managed with supported constructs

app.synth();
```

Currently, the autotrace injection of Amazon ECS workloads is opt-in:

```typescript
import { Lumigo } from '@lumigo/cdk-constructs-v2';
import { App, SecretValue } from 'aws-cdk-lib';

const app = new App();

// Add here stacks and constructs

new Lumigo({lumigoToken:SecretValue.secretsManager('LumigoToken')}).traceEverything(app, {
  traceEcs: true,  // This activates adding tracing to Amazon ECS task definitions and services as well
});

app.synth();
```

### Instrumenting a CDK stack

The following code will apply Lumigo autotracing to all the [supported AWS Lambda constructs](#supported-constructs) in the instrumented stack:

```typescript
import { Lumigo } from '@lumigo/cdk-constructs-v2';
import { App, SecretValue, Stack, StackProps } from 'aws-cdk-lib';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export class NodejsStack extends Stack {

    constructor(scope: Construct, id: string, props: StackProps = {}) {
        super(scope, id, props);

        new Function(this, 'MyLambda', {
            code: new InlineCode('foo'),
            handler: 'index.handler',
            runtime: Runtime.NODEJS_14_X,
        });

    }

}

const app = new App();

const stack = new NodejsStack(app, 'NodejsTestStack', {
    env: {
        region: 'eu-central-1',
    }
}); 

new Lumigo({lumigoToken:SecretValue.secretsManager('LumigoToken')}).traceEverything(stack);

app.synth();
```

```typescript
import { Lumigo } from '@lumigo/cdk-constructs-v2';
import { App, SecretValue, Stack, StackProps } from 'aws-cdk-lib';
import { FargateService } from 'aws-cdk-lib/aws-ecs';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export class NodejsStack extends Stack {

    constructor(scope: Construct, id: string, props: StackProps = {}) {
        super(scope, id, props);

        new Function(this, 'MyLambda', {
            code: new InlineCode('foo'),
            handler: 'index.handler',
            runtime: Runtime.NODEJS_14_X,
        });

        new FargateService(this, 'MyFargateService', {
            ...
        });

    }

}

const app = new App();

const stack = new NodejsStack(app, 'NodejsTestStack', {
    env: {
        region: 'eu-central-1',
    }
}); 

new Lumigo({lumigoToken:SecretValue.secretsManager('LumigoToken')}).traceEverything(stack, {
  traceEcs: true,  // This activates adding tracing to Amazon ECS task definitions and services as well  
});

app.synth();
```

### Instrumenting single functions

```typescript
import { Lumigo } from '@lumigo/cdk-constructs-v2';
import { App, SecretValue, Stack, StackProps } from 'aws-cdk-lib';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

interface NodejsStackProps extends StackProps {
  readonly lumigo: Lumigo;
}

export class NodejsStack extends Stack {

    constructor(scope: Construct, id: string, props: NodejsStackProps = {}) {
        super(scope, id, props);

        const handler = new Function(this, 'MyLambda', {
            code: new InlineCode('foo'),
            handler: 'index.handler',
            runtime: Runtime.NODEJS_14_X,
        });

        props.lumigo.traceLambda(handler);
    }

}

const app = new App();

const lumigo = new Lumigo({lumigoToken:SecretValue.secretsManager('LumigoToken')});

const stack = new NodejsStack(app, 'NodejsTestStack', {
    env: {
        region: 'eu-central-1',
    },
    lumigo,
}); 

app.synth();
```

### Instrumenting single ECS services

```typescript
import { Lumigo } from '@lumigo/cdk-constructs-v2';
import { App, SecretValue, Stack, StackProps } from 'aws-cdk-lib';
import { FargateService } from 'aws-cdk-lib/aws-ecs';
import { Construct } from 'constructs';

interface NodejsStackProps extends StackProps {
  readonly lumigo: Lumigo;
}

export class NodejsStack extends Stack {

    constructor(scope: Construct, id: string, props: NodejsStackProps = {}) {
        super(scope, id, props);

        const service = new FargateService(this, 'MyFargateService', {
            ...
        });

        props.lumigo.traceEcsService(service);
    }

}

const app = new App();

const lumigo = new Lumigo({lumigoToken:SecretValue.secretsManager('LumigoToken')});

const stack = new NodejsStack(app, 'NodejsTestStack', {
    env: {
        region: 'eu-central-1',
    },
    lumigo,
}); 

app.synth();
```

### Instrumenting single ECS task definitions

Instrumenting at the level of the Amazon ECS task definition enables you to share the instrumented task definition across multiple ECS services: 

```typescript
import { Lumigo } from '@lumigo/cdk-constructs-v2';
import { App, SecretValue, Stack, StackProps } from 'aws-cdk-lib';
import { FargateService, FargateTaskDefinition } from 'aws-cdk-lib/aws-ecs';
import { Construct } from 'constructs';

interface NodejsStackProps extends StackProps {
  readonly lumigo: Lumigo;
}

export class NodejsStack extends Stack {

    constructor(scope: Construct, id: string, props: NodejsStackProps = {}) {
        super(scope, id, props);

        const taskDefinition = new FargateTaskDefinition(, this 'MyFargateTaskDefinition', {
            ...
        })
        new FargateService(this, 'MyFargateService1', {
            taskDefinition: taskDefinition,
            ...
        });
        new FargateService(this, 'MyFargateService2', {
            taskDefinition: taskDefinition,
            ...
        });

        props.lumigo.traceEcsTaskDefinition(taskDefinition);
    }

}

const app = new App();

const lumigo = new Lumigo({lumigoToken:SecretValue.secretsManager('LumigoToken')});

const stack = new NodejsStack(app, 'NodejsTestStack', {
    env: {
        region: 'eu-central-1',
    },
    lumigo,
}); 

app.synth();
```

### Lambda Layer Version Pinning

Unless specified otherwise, when instrumenting a Lambda function, the Lumigo CDK integration will use the latest known Lambda layer at the moment of publishing the adopted version of the `@lumigo/cdk-constructs-v2` package.
(It is considered bad practice in CDK Construct designs to have API calls take place inside the `synth` phase, so new versions of the `@lumigo/cdk-constructs-v2` are regularly released, pointing at the latest layers.)

The pinning of specific layer versions can be performed at the level of the entire application or stack:

```typescript
import { Lumigo } from '@lumigo/cdk-constructs-v2';
import { App, SecretValue } from 'aws-cdk-lib';

const app = new App();

// Add here stacks and constructs

new Lumigo({lumigoToken:SecretValue.secretsManager('LumigoToken')}).traceEverything(app, {
    lambdaNodejsLayerVersion: 42,  // All Lambda functions with a supported Node.js runtime will use the layer v42
    lambdaPythonLayerVersion: 1,  // All Lambda functions with a supported Python runtime will use the layer v1
});

app.synth();
```

Layer-version pinning can also be done function-by-function:

```typescript
export class MyNodejsLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props: LumigoStackProps) {
    super(scope, id, props);

    const handler = new Function(this, 'MyLambda', {
      code: new InlineCode('foo'),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });

    props.lumigo.traceLambda(handler, {
      layerVersion: 42,  // Which layer this is about (Node.js? Python?) is contextual to the `runtime` of the function
    });
  }
}
```

### Setting Lumigo tags

[Lumigo tags](https://docs.lumigo.io/docs/tags) add dimension to your Lambda functions so that they can be identified, managed, organized, searched for, and filtered in Lumigo.
They can be utilized to filter resources for projects, alerts and functions, helping you simplify the complexity of monitoring distributed applications.

Every `trace*` method that the `Lumigo` object offers to trace functions, ECS workloads, entire stacks or applications, supports also setting Lumigo tags on the traced resource:

```typescript
import { Lumigo } from '@lumigo/cdk-constructs-v2';
import { App, SecretValue } from 'aws-cdk-lib';

const app = new App();

// Add here stacks and constructs

new Lumigo({lumigoToken:SecretValue.secretsManager('LumigoToken')}).traceEverything(app, {
    lumigoTag: 'MY_TAG',
});

app.synth();
```

Behind the scenes, the Lumigo CDK integration sets the AWS Tag `LUMIGO_TAG` with the value you specify on the Lambda functions, ECS services and task definitions, etc.

### W3C TraceContext propagation in AWS Lambda

To be able to trace scenarios in which a Lambda function sends HTTP requests to an application instrumented with OpenTelemetry, like those using the [Lumigo OpenTelemetry Distro for JS](https://github.com/lumigo-io/opentelemetry-js-distro) and [Lumigo OpenTelemetry Distro for Python](https://github.com/lumigo-io/opentelemetry-python-distro) or other OpenTelemetry SDKs, the Lumigo Node.js and Python tracers can optionally add [W3C TraceContext](https://www.w3.org/TR/trace-context/) HTTP headers to outgoing requests.

Aty the tracer level, the support of W3C TraceContext is currently opt-in via the `LUMIGO_PROPAGATE_W3C=true` environment variable.
But the Lumigo CDK integration can apply it to all your Lambda functions:

```typescript
import { Lumigo } from '@lumigo/cdk-constructs-v2';
import { App, SecretValue } from 'aws-cdk-lib';

const app = new App();

// Add here stacks and constructs

new Lumigo({lumigoToken:SecretValue.secretsManager('LumigoToken')}).traceEverything(app, {
    lambdaEnableW3CTraceContext: true, // <--- This parameter set to true activates the W3C TraceContext propagation for all supported Lambda functions
});

app.synth();
```

Activating W3C TraceContext support is also supported on a function-by-function basis:

```typescript
export class MyNodejsLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props: LumigoStackProps) {
    super(scope, id, props);

    const handler = new Function(this, 'MyLambda', {
      code: new InlineCode('foo'),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });

    props.lumigo.traceLambda(handler, {
      enableW3CTraceContext: true,  // <--- This parameter set to true activates the W3C TraceCntext propagation for this Lambda function.
    });
  }
}
```

The Lumigo tracers used for ECS tracing natively use the W3C TraceContext standard, and no opt-in is necessary.

## How does it work?

Like any other CDK construct, the Lumigo CDK integration contributes changes to the CloudFormation templates that [CDK generates for you](https://docs.aws.amazon.com/cdk/v2/guide/home.html).
The changes that the Lumigo CDK integration applies are focused on enabling out-of-the-box distributed tracing for the AWS Lambda and Amazon ECS workloads you manage via AWS CDK.

### Instrumentation of AWS Lambda functions

When encountering a [supported AWS Lambda-related construct](#supported-aws-lambda-constructs), the Lumigo CDK integration:

1. adds a Lambda layer containing the tracer for the Lambda function runtime; the layer to be used depends on the runtime, and the version to be used ([Node.js](./src/lambda_layers_nodejs.json), [Python](./src/lambda_layers_python.json)) is the latest at the time of the release of the version of the `@lumigo/cdk-constructs-v2` package. Using a different version of the layer is supported via [version pinning](#lambda-layer-version-pinning).
1. sets the `LUMIGO_TRACER_TOKEN` environment variable with, as value, the plain-text value of the [`SecretValue`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.SecretValue.html#static-unsafewbrplainwbrtextsecret) passed on instantiation of the `Lumigo` object. The value should be a valid [Lumigo Token](https://docs.lumigo.io/docs/lumigo-tokens).
1. adds runtime-dependent environment variables as documented in the [Lumigo AWS Lambda manual tracing](https://docs.lumigo.io/docs/manual-instrumentation) documentation.

### Instrumentation of Amazon ECS workloads

**Note:** The automatic instrumentation of Amazon ECS workloads is currently **experimental**.

#### Modifications applied to Amazon ECS task definitions

When encountering a [supported Amazon ECS-related construct](#supported-amazon-ecs-constructs), the Lumigo CDK integration:

1. Adds an [ephemeral volume](https://docs.aws.amazon.com/AmazonECS/latest/userguide/using_data_volumes.html) called `lumigo-injector` to the task definition
1. Adds a container called `lumigo-injector` that uses a [public Amazon ECR image](public.ecr.aws/lumigo/lumigo-autotrace:latest); the image contains the latest copies of the [Lumigo OpenTelemetry Distro for Node.js](https://github.com/lumigo-io/opentelemetry-js-distro) and [Lumigo OpenTelemetry Distro for Python](https://github.com/lumigo-io/opentelemetry-python-distro), alongside an `LD_PRELOAD` injector that is not unlike this [OpenTelemetry Injector](https://github.com/mmanciop/opentelemetry-injector).
1. The `lumigo-injector` volume is mounted to all containers in the task definition, including the `lumigo-injector` container.
1. All containers other than `lumigo-injector` get added:
  1. A [container dependency](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_ContainerDependency.html) on the completion of the `lumigo-injector` container.
  1. The `LUMIGO_TRACER_TOKEN` environment variable with, as value, the plain-text value of the [`SecretValue`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.SecretValue.html#static-unsafewbrplainwbrtextsecret) passed on instantiation of the `Lumigo` object.
  1. The `LD_PRELOAD` environment variable pointing to the Lumigo Injector's `lumigo_injector.so` file, which performs as needed the activation of the Python or Node.js tracers delivered by the Lumigo OpenTelemetry Distros for Node.js and Python as needed.

#### How tracing works for Amazon ECS task definitions

The automatic instrumentation of Amazon ECS task definitions works based on the principle that the runtimes (CPython, Node.js, etc.) inside your Amazon ECS tasks can be traced with OpenTelemetry Distros like Lumigo's that have no-code activation capabilities (see [Node.js](https://github.com/lumigo-io/opentelemetry-js-distro#no-code-activation), [Python](https://github.com/lumigo-io/opentelemetry-python-distro#no-code-activation)) if:

1. **Tracer delivery:** The files of the tracers are available on the filesystem of your containers in a way that the application process has read-access to them
1. **Tracer activation:** The tracer is activated therough the application's process environment

The tracer delivery is accomplished by adding the shared `lumigo-injector` volume, and copy into it the Lumigo OpenTelemetry Distros before all other containers can start (thanks to the container dependencies).
The tracer activation is based on manipulating the process environment of your applications inside the containers via the Lumigo Injector.
The Lumigo Injector is an [`LD_PRELOAD`](https://stackoverflow.com/questions/426230/what-is-the-ld-preload-trick) object that ensure that, when your application looks up environment variables like `NODE_OPTIONS` or `AUTOWRAPT_BOOTSTRAP` (used for the activation of the Lumigo OpenTelemetry Distros for Node.js and Python, respectively), the right value is returned.
