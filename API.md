# Lumigo CDK Integrations

[![View on Construct Hub](https://constructs.dev/badge?package=%40lumigo%2Fcdk-constructs-v2)](https://constructs.dev/packages/@lumigo/cdk-constructs-v2)

This repository provides means of adding Lumigo tracing as "infrastructure-as-code" to Lambda functions and ECS workloads deployed via the [AWS Cloud Development Kit (CDK) v2](https://docs.aws.amazon.com/cdk/api/v2/).

If instead of the AWS CDK v2, you are using the [Serverless Framework](https://www.serverless.com/), refer to the [`serverless-lumigo` plugin](https://github.com/lumigo-io/serverless-lumigo-plugin) documentation.

With the Lumigo CDK Constructs, getting your Lambda and ECS workloads monitored by Lumigo across your entire CDK applciation is as easy as:

```typescript
import { Lumigo } from '@lumigo/cdk-constructs-v2';
import { App, SecretValue } from 'aws-cdk-lib';

const app = new App();

// Add here stacks and constructs

// This will trace all Lambda functions and ECS workloads managed with supported constructs
new Lumigo({lumigoToken:SecretValue.secretsManager('LumigoToken')}).traceEverything(app);

app.synth();
```

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
| [`aws-cdk-lib/aws-lambda`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda-readme.html) | [`Function`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda.Function.html) | Lumigo tracing will be added to the supported `nodejs` and `python3.x` runtimes; `provided` runtimes will not be instrumented. |
| [`aws-cdk-lib/aws-lambda-nodejs`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_nodejs-readme.html) | [`NodejsFunction`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_nodejs.NodejsFunction.html) | |
| [`@aws-cdk/aws-lambda-python-alpha`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-lambda-python-alpha-readme.html) | [`PythonFunction`](https://docs.aws.amazon.com/cdk/api/v2/docs/@aws-cdk_aws-lambda-python-alpha.PythonFunction.html) | The `PythonFunction` is not GA in AWS CDK 2, but is supported by the Lumigo CDK integration regardless |

#### Supported Amazon ECS Constructs

The Lumigo CDK integration applies automated distributed tracing to Java, Node.js and Python applications run on Amazon ECS and managed by the following constructs:

| AWS CDK Package | Constructs | Notes |
|-----------------|------------|-------|
| [`aws-cdk-lib/aws-ecs`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs-readme.html) | [`Ec2Service`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs.Ec2Service.html) | [Java](https://github.com/lumigo-io/opentelemetry-java-distro), [Node.js](https://github.com/lumigo-io/opentelemetry-js-distro#supported-packages) and [Python](https://github.com/lumigo-io/opentelemetry-python-distro#supported-packages) distributed tracing |
| [`aws-cdk-lib/aws-ecs`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs-readme.html) | [`Ec2TaskDefinition`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs.Ec2TaskDefinition.html) | [Java](https://github.com/lumigo-io/opentelemetry-java-distro), [Node.js](https://github.com/lumigo-io/opentelemetry-js-distro#supported-packages) and [Python](https://github.com/lumigo-io/opentelemetry-python-distro#supported-packages) distributed tracing |
| [`aws-cdk-lib/aws-ecs`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs-readme.html) | [`FargateService`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs.FargateService.html) | [Java](https://github.com/lumigo-io/opentelemetry-java-distro), [Node.js](https://github.com/lumigo-io/opentelemetry-js-distro#supported-packages) and [Python](https://github.com/lumigo-io/opentelemetry-python-distro#supported-packages) distributed tracing |
| [`aws-cdk-lib/aws-ecs`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs-readme.html) | [`FargateTaskDefinition`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs.FargateTaskDefinition.html) | [Java](https://github.com/lumigo-io/opentelemetry-java-distro), [Node.js](https://github.com/lumigo-io/opentelemetry-js-distro#supported-packages) and [Python](https://github.com/lumigo-io/opentelemetry-python-distro#supported-packages) distributed tracing |
| [`aws-cdk-lib/aws-ecs-patterns`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns-readme.html) | [`ApplicationLoadBalancedEc2Service`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns.ApplicationLoadBalancedEc2Service.html) | [Java](https://github.com/lumigo-io/opentelemetry-java-distro), [Node.js](https://github.com/lumigo-io/opentelemetry-js-distro#supported-packages) and [Python](https://github.com/lumigo-io/opentelemetry-python-distro#supported-packages) distributed tracing |
| [`aws-cdk-lib/aws-ecs-patterns`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns-readme.html) | [`ApplicationLoadBalancedFargateService`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns.ApplicationLoadBalancedFargateService.html) | [Java](https://github.com/lumigo-io/opentelemetry-java-distro), [Node.js](https://github.com/lumigo-io/opentelemetry-js-distro#supported-packages) and [Python](https://github.com/lumigo-io/opentelemetry-python-distro#supported-packages) distributed tracing |
| [`aws-cdk-lib/aws-ecs-patterns`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns-readme.html) | [`ApplicationMultipleTargetGroupsEc2Service`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns.ApplicationMultipleTargetGroupsEc2Service.html) | [Java](https://github.com/lumigo-io/opentelemetry-java-distro), [Node.js](https://github.com/lumigo-io/opentelemetry-js-distro#supported-packages) and [Python](https://github.com/lumigo-io/opentelemetry-python-distro#supported-packages) distributed tracing |
| [`aws-cdk-lib/aws-ecs-patterns`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns-readme.html) | [`ApplicationMultipleTargetGroupsFargateService`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns.ApplicationMultipleTargetGroupsFargateService.html) | [Java](https://github.com/lumigo-io/opentelemetry-java-distro), [Node.js](https://github.com/lumigo-io/opentelemetry-js-distro#supported-packages) and [Python](https://github.com/lumigo-io/opentelemetry-python-distro#supported-packages) distributed tracing |
| [`aws-cdk-lib/aws-ecs-patterns`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns-readme.html) | [`NetworkLoadBalancedEc2Service`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns.NetworkLoadBalancedEc2Service.html) | [Java](https://github.com/lumigo-io/opentelemetry-java-distro), [Node.js](https://github.com/lumigo-io/opentelemetry-js-distro#supported-packages) and [Python](https://github.com/lumigo-io/opentelemetry-python-distro#supported-packages) distributed tracing |
| [`aws-cdk-lib/aws-ecs-patterns`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns-readme.html) | [`NetworkLoadBalancedFargateService`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns.NetworkLoadBalancedFargateService.html) | [Java](https://github.com/lumigo-io/opentelemetry-java-distro), [Node.js](https://github.com/lumigo-io/opentelemetry-js-distro#supported-packages) and [Python](https://github.com/lumigo-io/opentelemetry-python-distro#supported-packages) distributed tracing |
| [`aws-cdk-lib/aws-ecs-patterns`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns-readme.html) | [`NetworkMultipleTargetGroupsEc2Service`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns.NetworkMultipleTargetGroupsEc2Service.html) | [Java](https://github.com/lumigo-io/opentelemetry-java-distro), [Node.js](https://github.com/lumigo-io/opentelemetry-js-distro#supported-packages) and [Python](https://github.com/lumigo-io/opentelemetry-python-distro#supported-packages) distributed tracing |
| [`aws-cdk-lib/aws-ecs-patterns`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns-readme.html) | [`NetworkMultipleTargetGroupsFargateService`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns.NetworkMultipleTargetGroupsFargateService.html) | [Java](https://github.com/lumigo-io/opentelemetry-java-distro), [Node.js](https://github.com/lumigo-io/opentelemetry-js-distro#supported-packages) and [Python](https://github.com/lumigo-io/opentelemetry-python-distro#supported-packages) distributed tracing |
| [`aws-cdk-lib/aws-ecs-patterns`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns-readme.html) | [`QueueProcessingEc2Service`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns.QueueProcessingEc2Service.html) | [Java](https://github.com/lumigo-io/opentelemetry-java-distro), [Node.js](https://github.com/lumigo-io/opentelemetry-js-distro#supported-packages) and [Python](https://github.com/lumigo-io/opentelemetry-python-distro#supported-packages) distributed tracing |
| [`aws-cdk-lib/aws-ecs-patterns`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns-readme.html) | [`QueueProcessingFargateService`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns.QueueProcessingFargateService.html) | [Java](https://github.com/lumigo-io/opentelemetry-java-distro), [Node.js](https://github.com/lumigo-io/opentelemetry-js-distro#supported-packages) and [Python](https://github.com/lumigo-io/opentelemetry-python-distro#supported-packages) distributed tracing |
| [`aws-cdk-lib/aws-ecs-patterns`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns-readme.html) | [`ScheduledEc2Task`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns.ScheduledEc2Task.html) | [Java](https://github.com/lumigo-io/opentelemetry-java-distro), [Node.js](https://github.com/lumigo-io/opentelemetry-js-distro#supported-packages) and [Python](https://github.com/lumigo-io/opentelemetry-python-distro#supported-packages) distributed tracing |
| [`aws-cdk-lib/aws-ecs-patterns`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns-readme.html) | [`ScheduledFargateTask`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns.ScheduledFargateTask.html) | [Java](https://github.com/lumigo-io/opentelemetry-java-distro), [Node.js](https://github.com/lumigo-io/opentelemetry-js-distro#supported-packages) and [Python](https://github.com/lumigo-io/opentelemetry-python-distro#supported-packages) distributed tracing |

The automated distributed tracing will work for all Java, Node.js and Python processes [dynamically linked](https://stackoverflow.com/questions/311882/what-do-statically-linked-and-dynamically-linked-mean) against [GNU C Library](https://www.gnu.org/software/libc/) (which is used by virtually all container base images except [Alpine Linux](https://www.alpinelinux.org/)) or [musl libc](https://musl.libc.org/) (for [Alpine Linux](https://www.alpinelinux.org/)-based containers).

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

new Lumigo({lumigoToken:SecretValue.secretsManager('LumigoToken')}).traceEverything(app); // This will trace all Lambda functions and ECS workloads managed with supported constructs

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
            runtime: Runtime.NODEJS_18_X,
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
            runtime: Runtime.NODEJS_18_X,
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

### Instrumenting single ECS scheduled task

```typescript
import { Lumigo } from '@lumigo/cdk-constructs-v2';
import { App, SecretValue, Stack, StackProps } from 'aws-cdk-lib';
import { ScheduledFargateTask } from 'aws-cdk-lib/aws-ecs-patterns';
import { Construct } from 'constructs';

interface NodejsStackProps extends StackProps {
  readonly lumigo: Lumigo;
}

export class NodejsStack extends Stack {

    constructor(scope: Construct, id: string, props: NodejsStackProps = {}) {
        super(scope, id, props);

        const scheduledTask = new ScheduledFargateTask(this, 'MyFargateScheduledTask', {
            ...
        });

        props.lumigo.traceEcsScheduledTask(scheduledTask);
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

### ECS tracer version pinning

The [tracing on Amazon ECS](#instrumenting-single-ecs-services) relies on the [`lumigo/lumigo-autotrace`](https://gallery.ecr.aws/lumigo/lumigo-autotrace) container image available on Amazon ECR Public Gallery.
By default, the Lumigo CDK integration will use the latest image tag at the moment of publishing the adopted version of the `@lumigo/cdk-constructs-v2` package.
(It is considered bad practice in CDK Construct designs to have API calls take place inside the `synth` phase, so new versions of the `@lumigo/cdk-constructs-v2` are regularly released, pointing at the latest container image tag.)

The pinning of specific layer versions can be performed at the level of the entire application or stack:

```typescript
import { Lumigo } from '@lumigo/cdk-constructs-v2';
import { App, SecretValue } from 'aws-cdk-lib';

const app = new App();

// Add here stacks and constructs

new Lumigo({lumigoToken:SecretValue.secretsManager('LumigoToken')}).traceEverything(app, {
    lumigoAutoTraceImage: 'public.ecr.aws/lumigo/lumigo-autotrace:v14',  // See https://gallery.ecr.aws/lumigo/lumigo-autotrace for the list of currently available tags
});

app.synth();
```

Image-version pinning can also be done for single Amazon ECS task definitions and services.

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

To be able to trace scenarios in which a Lambda function sends HTTP requests to an application instrumented with OpenTelemetry, like those using the [Lumigo OpenTelemetry Distro for Java](https://github.com/lumigo-io/opentelemetry-java-distro), [Lumigo OpenTelemetry Distro for JS](https://github.com/lumigo-io/opentelemetry-js-distro) and [Lumigo OpenTelemetry Distro for Python](https://github.com/lumigo-io/opentelemetry-python-distro) or other OpenTelemetry SDKs, the Lumigo Node.js and Python tracers can add [W3C TraceContext](https://www.w3.org/TR/trace-context/) HTTP headers to outgoing requests.

At the tracer level, the support of W3C TraceContext is regulated via the `LUMIGO_PROPAGATE_W3C` environment variable.
The Lumigo CDK integration will turn on the W3C TraceContext for all your Lambda functions by default.
If your Lambda functions are using some request-signing mechanism, and you wish to turn off W3C TraceContext propagation, set the `lambdaEnableW3CTraceContext` to `false` as follows:

```typescript
import { Lumigo } from '@lumigo/cdk-constructs-v2';
import { App, SecretValue } from 'aws-cdk-lib';

const app = new App();

// Add here stacks and constructs

new Lumigo({lumigoToken:SecretValue.secretsManager('LumigoToken')}).traceEverything(app, {
    lambdaEnableW3CTraceContext: false, // <--- This parameter set to false dectivates the W3C TraceContext propagation for all supported Lambda functions
});

app.synth();
```

Deactivating W3C TraceContext support is also supported on a function-by-function basis:

```typescript
export class MyNodejsLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props: LumigoStackProps) {
    super(scope, id, props);

    const handler = new Function(this, 'MyLambda', {
      code: new InlineCode('foo'),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_20_X,
    });

    props.lumigo.traceLambda(handler, {
      enableW3CTraceContext: false,  // <--- This parameter set to false deactivates the W3C TraceCntext propagation for this Lambda function.
    });
  }
}
```

## How does it work?

Like any other CDK construct, the Lumigo CDK integration contributes changes to the CloudFormation templates that [CDK generates for you](https://docs.aws.amazon.com/cdk/v2/guide/home.html).
The changes that the Lumigo CDK integration applies are focused on enabling out-of-the-box distributed tracing for the AWS Lambda and Amazon ECS workloads you manage via AWS CDK.

### Instrumentation of AWS Lambda functions

When encountering a [supported AWS Lambda-related construct](#supported-aws-lambda-constructs), the Lumigo CDK integration:

1. adds a Lambda layer containing the tracer for the Lambda function runtime; the layer to be used depends on the runtime, and the version to be used ([Node.js](./src/lambda_layers_nodejs.json), [Python](./src/lambda_layers_python.json)) is the latest at the time of the release of the version of the `@lumigo/cdk-constructs-v2` package. Using a different version of the layer is supported via [version pinning](#lambda-layer-version-pinning).
1. sets the `LUMIGO_TRACER_TOKEN` environment variable with, as value, the plain-text value of the [`SecretValue`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.SecretValue.html#static-unsafewbrplainwbrtextsecret) passed on instantiation of the `Lumigo` object. The value should be a valid [Lumigo Token](https://docs.lumigo.io/docs/lumigo-tokens).
1. adds runtime-dependent environment variables as documented in the [Lumigo AWS Lambda manual tracing](https://docs.lumigo.io/docs/manual-instrumentation) documentation.

### Instrumentation of Amazon ECS workloads

When encountering a [supported Amazon ECS-related construct](#supported-amazon-ecs-constructs), the Lumigo CDK integration:

1. Adds an [ephemeral volume](https://docs.aws.amazon.com/AmazonECS/latest/userguide/using_data_volumes.html) called `lumigo-injector` to the task definition
1. Adds a container called `lumigo-injector` that uses a [public Amazon ECR image](public.ecr.aws/lumigo/lumigo-autotrace:latest); the image contains the latest copies of the [Lumigo OpenTelemetry Distro for Java](https://github.com/lumigo-io/opentelemetry-java-distro), [Lumigo OpenTelemetry Distro for Node.js](https://github.com/lumigo-io/opentelemetry-js-distro) and [Lumigo OpenTelemetry Distro for Python](https://github.com/lumigo-io/opentelemetry-python-distro), alongside an `LD_PRELOAD` injector that is not unlike this [OpenTelemetry Injector](https://github.com/mmanciop/opentelemetry-injector).
1. The `lumigo-injector` volume is mounted to all containers in the task definition, including the `lumigo-injector` container.
1. All containers other than `lumigo-injector` get added:
  1. A [container dependency](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_ContainerDependency.html) on the completion of the `lumigo-injector` container.
  1. The `LUMIGO_TRACER_TOKEN` environment variable with, as value, the plain-text value of the [`SecretValue`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.SecretValue.html#static-unsafewbrplainwbrtextsecret) passed on instantiation of the `Lumigo` object.
  1. The `LD_PRELOAD` environment variable pointing to the Lumigo Injector's `lumigo_injector.so` file, which performs as needed the activation of the Python or Node.js tracers delivered by the Lumigo OpenTelemetry Distros for Node.js and Python as needed.

The automatic instrumentation of Amazon ECS task definitions works based on the principle that the runtimes (CPython, Node.js, etc.) inside your Amazon ECS tasks can be traced with OpenTelemetry Distros like Lumigo's that have no-code activation capabilities (see [Node.js](https://github.com/lumigo-io/opentelemetry-js-distro#no-code-activation), [Python](https://github.com/lumigo-io/opentelemetry-python-distro#no-code-activation)) if:

1. **Tracer delivery:** The files of the tracers are available on the filesystem of your containers in a way that the application process has read-access to them
1. **Tracer activation:** The tracer is activated therough the application's process environment

The tracer delivery is accomplished by adding the shared `lumigo-injector` volume, and copy into it the Lumigo OpenTelemetry Distros before all other containers can start (thanks to the container dependencies).
The tracer activation is based on manipulating the process environment of your applications inside the containers via the Lumigo Injector.
The Lumigo Injector is an [`LD_PRELOAD`](https://stackoverflow.com/questions/426230/what-is-the-ld-preload-trick) object that ensure that, when your application looks up environment variables like `NODE_OPTIONS` or `AUTOWRAPT_BOOTSTRAP` (used for the activation of the Lumigo OpenTelemetry Distros for Node.js and Python, respectively), the right value is returned.

# API Reference <a name="API Reference" id="api-reference"></a>


## Structs <a name="Structs" id="Structs"></a>

### LumigoProps <a name="LumigoProps" id="@lumigo/cdk-constructs-v2.LumigoProps"></a>

#### Initializer <a name="Initializer" id="@lumigo/cdk-constructs-v2.LumigoProps.Initializer"></a>

```typescript
import { LumigoProps } from '@lumigo/cdk-constructs-v2'

const lumigoProps: LumigoProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@lumigo/cdk-constructs-v2.LumigoProps.property.lumigoToken">lumigoToken</a></code> | <code>aws-cdk-lib.SecretValue</code> | A reference to a secret containing of the Lumigo token of the Lumigo project to be used with instrumented Lambda functions and ECS workloads. |

---

##### `lumigoToken`<sup>Required</sup> <a name="lumigoToken" id="@lumigo/cdk-constructs-v2.LumigoProps.property.lumigoToken"></a>

```typescript
public readonly lumigoToken: SecretValue;
```

- *Type:* aws-cdk-lib.SecretValue

A reference to a secret containing of the Lumigo token of the Lumigo project to be used with instrumented Lambda functions and ECS workloads.

Instructions on how to retrieve your Lumigo token are available in the [Lumigo tokens](https://docs.lumigo.io/docs/tags) documentation.
For more information concerning how AWS CDK 2 handles secrets, consult the [AWS SDK `SecretValue`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.SecretValue.html) documentation.

---

### LumigoTraceProps <a name="LumigoTraceProps" id="@lumigo/cdk-constructs-v2.LumigoTraceProps"></a>

#### Initializer <a name="Initializer" id="@lumigo/cdk-constructs-v2.LumigoTraceProps.Initializer"></a>

```typescript
import { LumigoTraceProps } from '@lumigo/cdk-constructs-v2'

const lumigoTraceProps: LumigoTraceProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@lumigo/cdk-constructs-v2.LumigoTraceProps.property.applyAutoTraceTag">applyAutoTraceTag</a></code> | <code>boolean</code> | Whether the Lumigo CDK constructs should automatically add the `lumigo:auto-trace` AWS tag with the version of the construct in use. |
| <code><a href="#@lumigo/cdk-constructs-v2.LumigoTraceProps.property.lambdaEnableW3CTraceContext">lambdaEnableW3CTraceContext</a></code> | <code>boolean</code> | Whether the Lumigo Lambda tracers will add the [W3C Trace Context](https://www.w3.org/TR/trace-context/) `traceparent` and `tracestate` HTTP headers to outgoing HTTP/HTTPS requests. These headers are necessary to correctly correlate the HTTP requests from Lambda to workloads instrumented with the Lumigo OpenTelemetry distributions. The only real case in which this property should be set to false, is if there is some HTTP request issued by the Lambda function that is going towards an API with request signature that is affected negatively by the additional headers. If you encounter such an occurrence, please get in touch with [Lumigo's support](https://support.lumigo.io); we will issue an update to the Lumigo Lambda tracers to automatically not add [W3C Trace Context](https://www.w3.org/TR/trace-context/) to those APIs. |
| <code><a href="#@lumigo/cdk-constructs-v2.LumigoTraceProps.property.lambdaNodejsLayerVersion">lambdaNodejsLayerVersion</a></code> | <code>number</code> | Which version of the `lumigo-node-tracer` AWS Lambda layer to be used when instrumenting AWS Lambda functions using a supported Node.js runtime. Available layer versions depend on the AWS region your Lambda function is deployed in, see the [`lumigo-node-tracer` versions](https://github.com/lumigo-io/lumigo-node/tree/master/layers) list. The default value is the latest Node.js layer at the time of release of this version of the Lumigo CDK constructs: [default Node.js versions](./src/lambda_layers_nodejs.json). |
| <code><a href="#@lumigo/cdk-constructs-v2.LumigoTraceProps.property.lambdaPythonLayerVersion">lambdaPythonLayerVersion</a></code> | <code>number</code> | Which version of the `lumigo-python-tracer` AWS Lambda layer to be used when instrumenting AWS Lambda functions using a supported Python runtime. |
| <code><a href="#@lumigo/cdk-constructs-v2.LumigoTraceProps.property.lumigoAutoTraceImage">lumigoAutoTraceImage</a></code> | <code>string</code> | Which container image to use to instrument ECS workloads. |
| <code><a href="#@lumigo/cdk-constructs-v2.LumigoTraceProps.property.lumigoTag">lumigoTag</a></code> | <code>string</code> | Which Lumigo tag to apply to your instrumented Lambda functions and ECS workloads. |
| <code><a href="#@lumigo/cdk-constructs-v2.LumigoTraceProps.property.traceEcs">traceEcs</a></code> | <code>boolean</code> | Whether to automatically trace all the Java, Node.js and Python Lambda functions deployed on ECS by this construct using the respective [Lumigo OpenTelemetry distributions](https://docs.lumigo.io/docs/containerized-applications). |
| <code><a href="#@lumigo/cdk-constructs-v2.LumigoTraceProps.property.traceLambda">traceLambda</a></code> | <code>boolean</code> | Whether to automatically trace all the Node.js and Python Lambda functions in this construct using [Lumigo Lambda auto-instrumentation](https://docs.lumigo.io/docs/auto-instrumentation). |

---

##### `applyAutoTraceTag`<sup>Optional</sup> <a name="applyAutoTraceTag" id="@lumigo/cdk-constructs-v2.LumigoTraceProps.property.applyAutoTraceTag"></a>

```typescript
public readonly applyAutoTraceTag: boolean;
```

- *Type:* boolean
- *Default:* true

Whether the Lumigo CDK constructs should automatically add the `lumigo:auto-trace` AWS tag with the version of the construct in use.

---

##### `lambdaEnableW3CTraceContext`<sup>Optional</sup> <a name="lambdaEnableW3CTraceContext" id="@lumigo/cdk-constructs-v2.LumigoTraceProps.property.lambdaEnableW3CTraceContext"></a>

```typescript
public readonly lambdaEnableW3CTraceContext: boolean;
```

- *Type:* boolean
- *Default:* true

Whether the Lumigo Lambda tracers will add the [W3C Trace Context](https://www.w3.org/TR/trace-context/) `traceparent` and `tracestate` HTTP headers to outgoing HTTP/HTTPS requests. These headers are necessary to correctly correlate the HTTP requests from Lambda to workloads instrumented with the Lumigo OpenTelemetry distributions. The only real case in which this property should be set to false, is if there is some HTTP request issued by the Lambda function that is going towards an API with request signature that is affected negatively by the additional headers. If you encounter such an occurrence, please get in touch with [Lumigo's support](https://support.lumigo.io); we will issue an update to the Lumigo Lambda tracers to automatically not add [W3C Trace Context](https://www.w3.org/TR/trace-context/) to those APIs.

---

##### `lambdaNodejsLayerVersion`<sup>Optional</sup> <a name="lambdaNodejsLayerVersion" id="@lumigo/cdk-constructs-v2.LumigoTraceProps.property.lambdaNodejsLayerVersion"></a>

```typescript
public readonly lambdaNodejsLayerVersion: number;
```

- *Type:* number

Which version of the `lumigo-node-tracer` AWS Lambda layer to be used when instrumenting AWS Lambda functions using a supported Node.js runtime. Available layer versions depend on the AWS region your Lambda function is deployed in, see the [`lumigo-node-tracer` versions](https://github.com/lumigo-io/lumigo-node/tree/master/layers) list. The default value is the latest Node.js layer at the time of release of this version of the Lumigo CDK constructs: [default Node.js versions](./src/lambda_layers_nodejs.json).

---

##### `lambdaPythonLayerVersion`<sup>Optional</sup> <a name="lambdaPythonLayerVersion" id="@lumigo/cdk-constructs-v2.LumigoTraceProps.property.lambdaPythonLayerVersion"></a>

```typescript
public readonly lambdaPythonLayerVersion: number;
```

- *Type:* number

Which version of the `lumigo-python-tracer` AWS Lambda layer to be used when instrumenting AWS Lambda functions using a supported Python runtime.

Available layer versions depend on the AWS region your Lambda function is deployed in, see the [`lumigo-python-tracer` versions](https://github.com/lumigo-io/python_tracer/tree/master/layers) list.
The default value is the latest Python layer at the time of release of this version of the Lumigo CDK constructs: [default Python versions](./src/lambda_layers_python.json).

---

##### `lumigoAutoTraceImage`<sup>Optional</sup> <a name="lumigoAutoTraceImage" id="@lumigo/cdk-constructs-v2.LumigoTraceProps.property.lumigoAutoTraceImage"></a>

```typescript
public readonly lumigoAutoTraceImage: string;
```

- *Type:* string

Which container image to use to instrument ECS workloads.

Use a valid, full image name of the [`lumigo/lumigo-autotrace` image](https://gallery.ecr.aws/lumigo/lumigo-autotrace), e.g., `public.ecr.aws/lumigo/lumigo-autotrace:v14`.

This property is exposed to support two use-cases: pinning a specific tag of the `lumigo/lumigo-autotrace` image, or supporting use-cases where Amazon ECS will not be able to pull from the Amazon ECS Public Gallery registry.
The available tags are listed on the [`lumigo/lumigo-autotrace` Amazon ECR Public Gallery](https://gallery.ecr.aws/lumigo/lumigo-autotrace) page.
The default value is the latest tag at the time of release of this version of the Lumigo CDK constructs: [default `lumigo/lumigo-autotrace` image](./src/lumigo_autotrace_image.json)

---

##### `lumigoTag`<sup>Optional</sup> <a name="lumigoTag" id="@lumigo/cdk-constructs-v2.LumigoTraceProps.property.lumigoTag"></a>

```typescript
public readonly lumigoTag: string;
```

- *Type:* string

Which Lumigo tag to apply to your instrumented Lambda functions and ECS workloads.

Lumigo Tags add dimension to your Lambda functions so that they can be identified, managed, organized, searched for, and filtered in Lumigo.
For more information on Lumigo tags, refer to the [Lumigo tokens](https://docs.lumigo.io/docs/tags) documentation.

---

##### `traceEcs`<sup>Optional</sup> <a name="traceEcs" id="@lumigo/cdk-constructs-v2.LumigoTraceProps.property.traceEcs"></a>

```typescript
public readonly traceEcs: boolean;
```

- *Type:* boolean
- *Default:* true

Whether to automatically trace all the Java, Node.js and Python Lambda functions deployed on ECS by this construct using the respective [Lumigo OpenTelemetry distributions](https://docs.lumigo.io/docs/containerized-applications).

---

##### `traceLambda`<sup>Optional</sup> <a name="traceLambda" id="@lumigo/cdk-constructs-v2.LumigoTraceProps.property.traceLambda"></a>

```typescript
public readonly traceLambda: boolean;
```

- *Type:* boolean
- *Default:* true

Whether to automatically trace all the Node.js and Python Lambda functions in this construct using [Lumigo Lambda auto-instrumentation](https://docs.lumigo.io/docs/auto-instrumentation).

---

### TraceEcsScheduledTaskProps <a name="TraceEcsScheduledTaskProps" id="@lumigo/cdk-constructs-v2.TraceEcsScheduledTaskProps"></a>

#### Initializer <a name="Initializer" id="@lumigo/cdk-constructs-v2.TraceEcsScheduledTaskProps.Initializer"></a>

```typescript
import { TraceEcsScheduledTaskProps } from '@lumigo/cdk-constructs-v2'

const traceEcsScheduledTaskProps: TraceEcsScheduledTaskProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@lumigo/cdk-constructs-v2.TraceEcsScheduledTaskProps.property.applyAutoTraceTag">applyAutoTraceTag</a></code> | <code>boolean</code> | Whether the Lumigo CDK constructs should automatically add the `lumigo:auto-trace` AWS tag with the version of the construct in use. |
| <code><a href="#@lumigo/cdk-constructs-v2.TraceEcsScheduledTaskProps.property.lumigoAutoTraceImage">lumigoAutoTraceImage</a></code> | <code>string</code> | Which container image to use to instrument ECS workloads. |
| <code><a href="#@lumigo/cdk-constructs-v2.TraceEcsScheduledTaskProps.property.lumigoTag">lumigoTag</a></code> | <code>string</code> | Which Lumigo tag to apply to your instrumented Lambda functions and ECS workloads. |

---

##### `applyAutoTraceTag`<sup>Optional</sup> <a name="applyAutoTraceTag" id="@lumigo/cdk-constructs-v2.TraceEcsScheduledTaskProps.property.applyAutoTraceTag"></a>

```typescript
public readonly applyAutoTraceTag: boolean;
```

- *Type:* boolean
- *Default:* true

Whether the Lumigo CDK constructs should automatically add the `lumigo:auto-trace` AWS tag with the version of the construct in use.

---

##### `lumigoAutoTraceImage`<sup>Optional</sup> <a name="lumigoAutoTraceImage" id="@lumigo/cdk-constructs-v2.TraceEcsScheduledTaskProps.property.lumigoAutoTraceImage"></a>

```typescript
public readonly lumigoAutoTraceImage: string;
```

- *Type:* string

Which container image to use to instrument ECS workloads.

Use a valid, full image name of the [`lumigo/lumigo-autotrace` image](https://gallery.ecr.aws/lumigo/lumigo-autotrace), e.g., `public.ecr.aws/lumigo/lumigo-autotrace:v14`.

This property is exposed to support two use-cases: pinning a specific tag of the `lumigo/lumigo-autotrace` image, or supporting use-cases where Amazon ECS will not be able to pull from the Amazon ECS Public Gallery registry.
The available tags are listed on the [`lumigo/lumigo-autotrace` Amazon ECR Public Gallery](https://gallery.ecr.aws/lumigo/lumigo-autotrace) page.
The default value is the latest tag at the time of release of this version of the Lumigo CDK constructs: [default `lumigo/lumigo-autotrace` image](./src/lumigo_autotrace_image.json)

---

##### `lumigoTag`<sup>Optional</sup> <a name="lumigoTag" id="@lumigo/cdk-constructs-v2.TraceEcsScheduledTaskProps.property.lumigoTag"></a>

```typescript
public readonly lumigoTag: string;
```

- *Type:* string

Which Lumigo tag to apply to your instrumented Lambda functions and ECS workloads.

Lumigo Tags add dimension to your Lambda functions so that they can be identified, managed, organized, searched for, and filtered in Lumigo.
For more information on Lumigo tags, refer to the [Lumigo tokens](https://docs.lumigo.io/docs/tags) documentation.

---

### TraceEcsServiceProps <a name="TraceEcsServiceProps" id="@lumigo/cdk-constructs-v2.TraceEcsServiceProps"></a>

#### Initializer <a name="Initializer" id="@lumigo/cdk-constructs-v2.TraceEcsServiceProps.Initializer"></a>

```typescript
import { TraceEcsServiceProps } from '@lumigo/cdk-constructs-v2'

const traceEcsServiceProps: TraceEcsServiceProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@lumigo/cdk-constructs-v2.TraceEcsServiceProps.property.applyAutoTraceTag">applyAutoTraceTag</a></code> | <code>boolean</code> | Whether the Lumigo CDK constructs should automatically add the `lumigo:auto-trace` AWS tag with the version of the construct in use. |
| <code><a href="#@lumigo/cdk-constructs-v2.TraceEcsServiceProps.property.lumigoAutoTraceImage">lumigoAutoTraceImage</a></code> | <code>string</code> | Which container image to use to instrument ECS workloads. |
| <code><a href="#@lumigo/cdk-constructs-v2.TraceEcsServiceProps.property.lumigoTag">lumigoTag</a></code> | <code>string</code> | Which Lumigo tag to apply to your instrumented Lambda functions and ECS workloads. |

---

##### `applyAutoTraceTag`<sup>Optional</sup> <a name="applyAutoTraceTag" id="@lumigo/cdk-constructs-v2.TraceEcsServiceProps.property.applyAutoTraceTag"></a>

```typescript
public readonly applyAutoTraceTag: boolean;
```

- *Type:* boolean
- *Default:* true

Whether the Lumigo CDK constructs should automatically add the `lumigo:auto-trace` AWS tag with the version of the construct in use.

---

##### `lumigoAutoTraceImage`<sup>Optional</sup> <a name="lumigoAutoTraceImage" id="@lumigo/cdk-constructs-v2.TraceEcsServiceProps.property.lumigoAutoTraceImage"></a>

```typescript
public readonly lumigoAutoTraceImage: string;
```

- *Type:* string

Which container image to use to instrument ECS workloads.

Use a valid, full image name of the [`lumigo/lumigo-autotrace` image](https://gallery.ecr.aws/lumigo/lumigo-autotrace), e.g., `public.ecr.aws/lumigo/lumigo-autotrace:v14`.

This property is exposed to support two use-cases: pinning a specific tag of the `lumigo/lumigo-autotrace` image, or supporting use-cases where Amazon ECS will not be able to pull from the Amazon ECS Public Gallery registry.
The available tags are listed on the [`lumigo/lumigo-autotrace` Amazon ECR Public Gallery](https://gallery.ecr.aws/lumigo/lumigo-autotrace) page.
The default value is the latest tag at the time of release of this version of the Lumigo CDK constructs: [default `lumigo/lumigo-autotrace` image](./src/lumigo_autotrace_image.json)

---

##### `lumigoTag`<sup>Optional</sup> <a name="lumigoTag" id="@lumigo/cdk-constructs-v2.TraceEcsServiceProps.property.lumigoTag"></a>

```typescript
public readonly lumigoTag: string;
```

- *Type:* string

Which Lumigo tag to apply to your instrumented Lambda functions and ECS workloads.

Lumigo Tags add dimension to your Lambda functions so that they can be identified, managed, organized, searched for, and filtered in Lumigo.
For more information on Lumigo tags, refer to the [Lumigo tokens](https://docs.lumigo.io/docs/tags) documentation.

---

### TraceEcsTaskDefinitionProps <a name="TraceEcsTaskDefinitionProps" id="@lumigo/cdk-constructs-v2.TraceEcsTaskDefinitionProps"></a>

#### Initializer <a name="Initializer" id="@lumigo/cdk-constructs-v2.TraceEcsTaskDefinitionProps.Initializer"></a>

```typescript
import { TraceEcsTaskDefinitionProps } from '@lumigo/cdk-constructs-v2'

const traceEcsTaskDefinitionProps: TraceEcsTaskDefinitionProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@lumigo/cdk-constructs-v2.TraceEcsTaskDefinitionProps.property.applyAutoTraceTag">applyAutoTraceTag</a></code> | <code>boolean</code> | Whether the Lumigo CDK constructs should automatically add the `lumigo:auto-trace` AWS tag with the version of the construct in use. |
| <code><a href="#@lumigo/cdk-constructs-v2.TraceEcsTaskDefinitionProps.property.lumigoAutoTraceImage">lumigoAutoTraceImage</a></code> | <code>string</code> | Which container image to use to instrument ECS workloads. |
| <code><a href="#@lumigo/cdk-constructs-v2.TraceEcsTaskDefinitionProps.property.lumigoTag">lumigoTag</a></code> | <code>string</code> | Which Lumigo tag to apply to your instrumented Lambda functions and ECS workloads. |

---

##### `applyAutoTraceTag`<sup>Optional</sup> <a name="applyAutoTraceTag" id="@lumigo/cdk-constructs-v2.TraceEcsTaskDefinitionProps.property.applyAutoTraceTag"></a>

```typescript
public readonly applyAutoTraceTag: boolean;
```

- *Type:* boolean
- *Default:* true

Whether the Lumigo CDK constructs should automatically add the `lumigo:auto-trace` AWS tag with the version of the construct in use.

---

##### `lumigoAutoTraceImage`<sup>Optional</sup> <a name="lumigoAutoTraceImage" id="@lumigo/cdk-constructs-v2.TraceEcsTaskDefinitionProps.property.lumigoAutoTraceImage"></a>

```typescript
public readonly lumigoAutoTraceImage: string;
```

- *Type:* string

Which container image to use to instrument ECS workloads.

Use a valid, full image name of the [`lumigo/lumigo-autotrace` image](https://gallery.ecr.aws/lumigo/lumigo-autotrace), e.g., `public.ecr.aws/lumigo/lumigo-autotrace:v14`.

This property is exposed to support two use-cases: pinning a specific tag of the `lumigo/lumigo-autotrace` image, or supporting use-cases where Amazon ECS will not be able to pull from the Amazon ECS Public Gallery registry.
The available tags are listed on the [`lumigo/lumigo-autotrace` Amazon ECR Public Gallery](https://gallery.ecr.aws/lumigo/lumigo-autotrace) page.
The default value is the latest tag at the time of release of this version of the Lumigo CDK constructs: [default `lumigo/lumigo-autotrace` image](./src/lumigo_autotrace_image.json)

---

##### `lumigoTag`<sup>Optional</sup> <a name="lumigoTag" id="@lumigo/cdk-constructs-v2.TraceEcsTaskDefinitionProps.property.lumigoTag"></a>

```typescript
public readonly lumigoTag: string;
```

- *Type:* string

Which Lumigo tag to apply to your instrumented Lambda functions and ECS workloads.

Lumigo Tags add dimension to your Lambda functions so that they can be identified, managed, organized, searched for, and filtered in Lumigo.
For more information on Lumigo tags, refer to the [Lumigo tokens](https://docs.lumigo.io/docs/tags) documentation.

---

### TraceLambdaProps <a name="TraceLambdaProps" id="@lumigo/cdk-constructs-v2.TraceLambdaProps"></a>

#### Initializer <a name="Initializer" id="@lumigo/cdk-constructs-v2.TraceLambdaProps.Initializer"></a>

```typescript
import { TraceLambdaProps } from '@lumigo/cdk-constructs-v2'

const traceLambdaProps: TraceLambdaProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@lumigo/cdk-constructs-v2.TraceLambdaProps.property.applyAutoTraceTag">applyAutoTraceTag</a></code> | <code>boolean</code> | Whether the Lumigo CDK constructs should automatically add the `lumigo:auto-trace` AWS tag with the version of the construct in use. |
| <code><a href="#@lumigo/cdk-constructs-v2.TraceLambdaProps.property.enableW3CTraceContext">enableW3CTraceContext</a></code> | <code>boolean</code> | Whether the Lumigo Lambda tracers will add the `traceparent` and `tracestate` [W3C Trace Context](https://www.w3.org/TR/trace-context/) headers to outgoing HTTP/HTTPS requests. These headers are necessary to correctly correlate the HTTP requests from Lambda to workloads instrumented with the Lumigo OpenTelemetry distributions. The only real case in which this property should be set to false, is if there is some HTTP request issued by the Lambda function that is going towards an API with request signature that is affected negatively by the additional headers. If you encounter such an occurrence, please get in touch with [Lumigo's support](https://support.lumigo.io); we will issue an update to the Lumigo Lambda tracers to automatically not add [W3C Trace Context](https://www.w3.org/TR/trace-context/) to those APIs. |
| <code><a href="#@lumigo/cdk-constructs-v2.TraceLambdaProps.property.layerVersion">layerVersion</a></code> | <code>number</code> | Which version of the appropriate Lumigo layer to be used; |
| <code><a href="#@lumigo/cdk-constructs-v2.TraceLambdaProps.property.lumigoTag">lumigoTag</a></code> | <code>string</code> | Which Lumigo tag to apply to your instrumented Lambda functions and ECS workloads. |

---

##### `applyAutoTraceTag`<sup>Optional</sup> <a name="applyAutoTraceTag" id="@lumigo/cdk-constructs-v2.TraceLambdaProps.property.applyAutoTraceTag"></a>

```typescript
public readonly applyAutoTraceTag: boolean;
```

- *Type:* boolean
- *Default:* true

Whether the Lumigo CDK constructs should automatically add the `lumigo:auto-trace` AWS tag with the version of the construct in use.

---

##### `enableW3CTraceContext`<sup>Optional</sup> <a name="enableW3CTraceContext" id="@lumigo/cdk-constructs-v2.TraceLambdaProps.property.enableW3CTraceContext"></a>

```typescript
public readonly enableW3CTraceContext: boolean;
```

- *Type:* boolean
- *Default:* true

Whether the Lumigo Lambda tracers will add the `traceparent` and `tracestate` [W3C Trace Context](https://www.w3.org/TR/trace-context/) headers to outgoing HTTP/HTTPS requests. These headers are necessary to correctly correlate the HTTP requests from Lambda to workloads instrumented with the Lumigo OpenTelemetry distributions. The only real case in which this property should be set to false, is if there is some HTTP request issued by the Lambda function that is going towards an API with request signature that is affected negatively by the additional headers. If you encounter such an occurrence, please get in touch with [Lumigo's support](https://support.lumigo.io); we will issue an update to the Lumigo Lambda tracers to automatically not add [W3C Trace Context](https://www.w3.org/TR/trace-context/) to those APIs.

---

##### `layerVersion`<sup>Optional</sup> <a name="layerVersion" id="@lumigo/cdk-constructs-v2.TraceLambdaProps.property.layerVersion"></a>

```typescript
public readonly layerVersion: number;
```

- *Type:* number

Which version of the appropriate Lumigo layer to be used;

layer versions change based on runtime and region.
Layer versions: [Node.js](https://github.com/lumigo-io/lumigo-node/tree/master/layers) and [Python](https://github.com/lumigo-io/python_tracer/tree/master/layers).
The default value is the latest layers at the time of release of this version of the Lumigo CDK constructs: [default Node.js versions](./src/lambda_layers_nodejs.json), [default Python versions](./src/lambda_layers_python.json)

---

##### `lumigoTag`<sup>Optional</sup> <a name="lumigoTag" id="@lumigo/cdk-constructs-v2.TraceLambdaProps.property.lumigoTag"></a>

```typescript
public readonly lumigoTag: string;
```

- *Type:* string

Which Lumigo tag to apply to your instrumented Lambda functions and ECS workloads.

Lumigo Tags add dimension to your Lambda functions so that they can be identified, managed, organized, searched for, and filtered in Lumigo.
For more information on Lumigo tags, refer to the [Lumigo tokens](https://docs.lumigo.io/docs/tags) documentation.

---

## Classes <a name="Classes" id="Classes"></a>

### Lumigo <a name="Lumigo" id="@lumigo/cdk-constructs-v2.Lumigo"></a>

The `Lumigo` class is the entry point for instrumenting workloads deployed via CDK constructs with Lumigo.

You usually would need only one instance of `Lumigo` per CDK application.

#### Initializers <a name="Initializers" id="@lumigo/cdk-constructs-v2.Lumigo.Initializer"></a>

```typescript
import { Lumigo } from '@lumigo/cdk-constructs-v2'

new Lumigo(props: LumigoProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@lumigo/cdk-constructs-v2.Lumigo.Initializer.parameter.props">props</a></code> | <code><a href="#@lumigo/cdk-constructs-v2.LumigoProps">LumigoProps</a></code> | *No description.* |

---

##### `props`<sup>Required</sup> <a name="props" id="@lumigo/cdk-constructs-v2.Lumigo.Initializer.parameter.props"></a>

- *Type:* <a href="#@lumigo/cdk-constructs-v2.LumigoProps">LumigoProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@lumigo/cdk-constructs-v2.Lumigo.asEcsExtension">asEcsExtension</a></code> | This method returns a wrapper that can be used in conjunction with the {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs.TaskDefinition.html#addwbrextensionextension\|TaskDefinition.addExtension} method. The effect is the same as using the {@link Lumigo#traceEcsTaskDefinition} method on the `TaskDefinition` on which you would invoke `TaskDefinition.addExtension`. |
| <code><a href="#@lumigo/cdk-constructs-v2.Lumigo.traceEcsScheduledTask">traceEcsScheduledTask</a></code> | Apply Lumigo autotracing for Java, Node.js and Python applications deployed through the provided ECS ScheduledTask construct. |
| <code><a href="#@lumigo/cdk-constructs-v2.Lumigo.traceEcsService">traceEcsService</a></code> | Apply Lumigo autotracing for Java, Node.js and Python applications deployed through the provided ECS Service construct. |
| <code><a href="#@lumigo/cdk-constructs-v2.Lumigo.traceEcsTaskDefinition">traceEcsTaskDefinition</a></code> | Apply Lumigo autotracing for Java, Node.js and Python applications deployed through the provided `TaskDefinition`. If the ECS workload does not contain Java, Node.js or Python applications, no distributed-tracing data will be reported to Lumigo. |
| <code><a href="#@lumigo/cdk-constructs-v2.Lumigo.traceEverything">traceEverything</a></code> | *No description.* |
| <code><a href="#@lumigo/cdk-constructs-v2.Lumigo.traceLambda">traceLambda</a></code> | Apply Lumigo autotracing for the provided Lambda function if it uses a supported Node.js or Python runtime. If the runtime used by the provided function is not supported by [Lumigo Lambda Auto-Tracing](https://docs.lumigo.io/docs/auto-instrumentation), a warning will be added to the CloudFormation template. |
| <code><a href="#@lumigo/cdk-constructs-v2.Lumigo.visit">visit</a></code> | *No description.* |

---

##### `asEcsExtension` <a name="asEcsExtension" id="@lumigo/cdk-constructs-v2.Lumigo.asEcsExtension"></a>

```typescript
public asEcsExtension(): ITaskDefinitionExtension
```

This method returns a wrapper that can be used in conjunction with the {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs.TaskDefinition.html#addwbrextensionextension|TaskDefinition.addExtension} method. The effect is the same as using the {@link Lumigo#traceEcsTaskDefinition} method on the `TaskDefinition` on which you would invoke `TaskDefinition.addExtension`.

##### `traceEcsScheduledTask` <a name="traceEcsScheduledTask" id="@lumigo/cdk-constructs-v2.Lumigo.traceEcsScheduledTask"></a>

```typescript
public traceEcsScheduledTask(scheduledTask: ScheduledEc2Task | ScheduledFargateTask, props?: TraceEcsScheduledTaskProps): void
```

Apply Lumigo autotracing for Java, Node.js and Python applications deployed through the provided ECS ScheduledTask construct.

###### `scheduledTask`<sup>Required</sup> <a name="scheduledTask" id="@lumigo/cdk-constructs-v2.Lumigo.traceEcsScheduledTask.parameter.scheduledTask"></a>

- *Type:* aws-cdk-lib.aws_ecs_patterns.ScheduledEc2Task | aws-cdk-lib.aws_ecs_patterns.ScheduledFargateTask

---

###### `props`<sup>Optional</sup> <a name="props" id="@lumigo/cdk-constructs-v2.Lumigo.traceEcsScheduledTask.parameter.props"></a>

- *Type:* <a href="#@lumigo/cdk-constructs-v2.TraceEcsScheduledTaskProps">TraceEcsScheduledTaskProps</a>

---

##### `traceEcsService` <a name="traceEcsService" id="@lumigo/cdk-constructs-v2.Lumigo.traceEcsService"></a>

```typescript
public traceEcsService(service: Ec2Service | FargateService | QueueProcessingEc2Service | QueueProcessingFargateService | NetworkLoadBalancedEc2Service | NetworkLoadBalancedFargateService | ApplicationLoadBalancedEc2Service | ApplicationLoadBalancedFargateService | ApplicationMultipleTargetGroupsEc2Service | ApplicationMultipleTargetGroupsFargateService | NetworkMultipleTargetGroupsEc2Service | NetworkMultipleTargetGroupsFargateService, props?: TraceEcsServiceProps): void
```

Apply Lumigo autotracing for Java, Node.js and Python applications deployed through the provided ECS Service construct.

###### `service`<sup>Required</sup> <a name="service" id="@lumigo/cdk-constructs-v2.Lumigo.traceEcsService.parameter.service"></a>

- *Type:* aws-cdk-lib.aws_ecs.Ec2Service | aws-cdk-lib.aws_ecs.FargateService | aws-cdk-lib.aws_ecs_patterns.QueueProcessingEc2Service | aws-cdk-lib.aws_ecs_patterns.QueueProcessingFargateService | aws-cdk-lib.aws_ecs_patterns.NetworkLoadBalancedEc2Service | aws-cdk-lib.aws_ecs_patterns.NetworkLoadBalancedFargateService | aws-cdk-lib.aws_ecs_patterns.ApplicationLoadBalancedEc2Service | aws-cdk-lib.aws_ecs_patterns.ApplicationLoadBalancedFargateService | aws-cdk-lib.aws_ecs_patterns.ApplicationMultipleTargetGroupsEc2Service | aws-cdk-lib.aws_ecs_patterns.ApplicationMultipleTargetGroupsFargateService | aws-cdk-lib.aws_ecs_patterns.NetworkMultipleTargetGroupsEc2Service | aws-cdk-lib.aws_ecs_patterns.NetworkMultipleTargetGroupsFargateService

---

###### `props`<sup>Optional</sup> <a name="props" id="@lumigo/cdk-constructs-v2.Lumigo.traceEcsService.parameter.props"></a>

- *Type:* <a href="#@lumigo/cdk-constructs-v2.TraceEcsServiceProps">TraceEcsServiceProps</a>

---

##### `traceEcsTaskDefinition` <a name="traceEcsTaskDefinition" id="@lumigo/cdk-constructs-v2.Lumigo.traceEcsTaskDefinition"></a>

```typescript
public traceEcsTaskDefinition(taskDefinition: Ec2TaskDefinition | FargateTaskDefinition, props?: TraceEcsTaskDefinitionProps): void
```

Apply Lumigo autotracing for Java, Node.js and Python applications deployed through the provided `TaskDefinition`. If the ECS workload does not contain Java, Node.js or Python applications, no distributed-tracing data will be reported to Lumigo.

###### `taskDefinition`<sup>Required</sup> <a name="taskDefinition" id="@lumigo/cdk-constructs-v2.Lumigo.traceEcsTaskDefinition.parameter.taskDefinition"></a>

- *Type:* aws-cdk-lib.aws_ecs.Ec2TaskDefinition | aws-cdk-lib.aws_ecs.FargateTaskDefinition

---

###### `props`<sup>Optional</sup> <a name="props" id="@lumigo/cdk-constructs-v2.Lumigo.traceEcsTaskDefinition.parameter.props"></a>

- *Type:* <a href="#@lumigo/cdk-constructs-v2.TraceEcsTaskDefinitionProps">TraceEcsTaskDefinitionProps</a>

---

##### `traceEverything` <a name="traceEverything" id="@lumigo/cdk-constructs-v2.Lumigo.traceEverything"></a>

```typescript
public traceEverything(root: App | Stack, props?: LumigoTraceProps): void
```

###### `root`<sup>Required</sup> <a name="root" id="@lumigo/cdk-constructs-v2.Lumigo.traceEverything.parameter.root"></a>

- *Type:* aws-cdk-lib.App | aws-cdk-lib.Stack

---

###### `props`<sup>Optional</sup> <a name="props" id="@lumigo/cdk-constructs-v2.Lumigo.traceEverything.parameter.props"></a>

- *Type:* <a href="#@lumigo/cdk-constructs-v2.LumigoTraceProps">LumigoTraceProps</a>

---

##### `traceLambda` <a name="traceLambda" id="@lumigo/cdk-constructs-v2.Lumigo.traceLambda"></a>

```typescript
public traceLambda(lambda: Function | NodejsFunction | PythonFunction, props?: TraceLambdaProps): void
```

Apply Lumigo autotracing for the provided Lambda function if it uses a supported Node.js or Python runtime. If the runtime used by the provided function is not supported by [Lumigo Lambda Auto-Tracing](https://docs.lumigo.io/docs/auto-instrumentation), a warning will be added to the CloudFormation template.

###### `lambda`<sup>Required</sup> <a name="lambda" id="@lumigo/cdk-constructs-v2.Lumigo.traceLambda.parameter.lambda"></a>

- *Type:* aws-cdk-lib.aws_lambda.Function | aws-cdk-lib.aws_lambda_nodejs.NodejsFunction | @aws-cdk/aws-lambda-python-alpha.PythonFunction

---

###### `props`<sup>Optional</sup> <a name="props" id="@lumigo/cdk-constructs-v2.Lumigo.traceLambda.parameter.props"></a>

- *Type:* <a href="#@lumigo/cdk-constructs-v2.TraceLambdaProps">TraceLambdaProps</a>

---

##### `visit` <a name="visit" id="@lumigo/cdk-constructs-v2.Lumigo.visit"></a>

```typescript
public visit(construct: IConstruct): void
```

###### `construct`<sup>Required</sup> <a name="construct" id="@lumigo/cdk-constructs-v2.Lumigo.visit.parameter.construct"></a>

- *Type:* constructs.IConstruct

---


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@lumigo/cdk-constructs-v2.Lumigo.property.props">props</a></code> | <code><a href="#@lumigo/cdk-constructs-v2.LumigoProps">LumigoProps</a></code> | *No description.* |

---

##### `props`<sup>Required</sup> <a name="props" id="@lumigo/cdk-constructs-v2.Lumigo.property.props"></a>

```typescript
public readonly props: LumigoProps;
```

- *Type:* <a href="#@lumigo/cdk-constructs-v2.LumigoProps">LumigoProps</a>

---



