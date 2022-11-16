# Lumigo CDK Integrations

This repository provides means of adding Lumigo tracing as "infrastructure-as-code" to Lambda functions deployed via the [AWS Cloud Development Kit (CDK) v2](https://docs.aws.amazon.com/cdk/api/v2/).

If instead of the AWS CDK v2, you are using the [Serverless Framework](https://www.serverless.com/), refer to the [`serverless-lumigo` plugin](https://github.com/lumigo-io/serverless-lumigo-plugin) documentation.

## Installation

### TypeScript / JavaScript

With `yarn`:

```sh
yarn install 'lumigo-cdk2-alpha'
```

With `npm`:

```sh
npm install 'lumigo-cdk2-alpha'
```

### Go

TODO

### Java

TODO

### .NET

TODO

### Python

TODO

## Usage

The Lumigo CDK integration enables you to trace all the applicable constructs inside an CDK App or a Stack, as well on a function-by-function basis.
The only requirement to use the Lumigo CDK integration is to have the [Lumigo token](https://docs.lumigo.io/docs/lumigo-tokens) stored in a way that can be accessed as a [`SecretValue`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.SecretValue.html), which supports, among other means of accessing secrets via the CDK:

* [AWS Secrets Manager](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.SecretValue.html#static-secretswbrmanagersecretid-options)
* [AWS Systems Manager (SSM) parameters](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.SecretValue.html#static-ssmwbrsecureparametername-version)

### Instrumenting the entire CDK application

The following code will apply Lumigo autotracing to all the [supported constructs](#supported-constructs):

```typescript
import { Lumigo } from 'lumigo-cdk2-alpha';
import { App, SecretValue } from 'aws-cdk-lib';

const app = new App();

// Add here stacks and constructs

new Lumigo({lumigoToken:SecretValue.secretsManager('LumigoToken')}).traceEverything(app);

app.synth();
```

The `Lumigo.traceEverything` functionality is built using CDK [Aspects](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.Aspects.html), which can also be used directly as follows:

```typescript
import { Lumigo } from 'lumigo-cdk2-alpha';
import { App, Aspects, SecretValue } from 'aws-cdk-lib';

const app = new App();

// Add here stacks and constructs

Aspects.of(app).add(new Lumigo({lumigoToken:SecretValue.secretsManager('LumigoToken')}).asAspect());

app.synth();
```

### Instrumenting a CDK stack

The following code will apply Lumigo autotracing to all the [supported constructs](#supported-constructs) in the instrumented stack:

```typescript
import { Lumigo } from 'lumigo-cdk2-alpha';
import { App, SecretValue } from 'aws-cdk-lib';

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

### Instrumenting single functions

```typescript
import { Lumigo } from 'lumigo-cdk2-alpha';
import { App, SecretValue } from 'aws-cdk-lib';

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

const lumigo = new Lumigo({lumigoToken:SecretValue.secretsManager('LumigoToken')}).traceEverything(stack);

const stack = new NodejsStack(app, 'NodejsTestStack', {
    env: {
        region: 'eu-central-1',
    },
    lumigo,
}); 

app.synth();
```

### Lambda Layer Version Pinning

Unless specified otherwise, when instrumenting a Lambda function, the Lumigo CDK integration will use the latest known Lambda layer at the moment of publishing the Lumigo CDK integration version.
(It is considered bad practice in CDK Construct designs to have API calls take place inside the `synth` phase, so new versions of the `lumigo-cdk2-alpha` will regularly be released, pointing at the latest layers.)

The pinning of specific layer versions can be performed at the level of the entire application or stack:

```typescript
import { Lumigo } from 'lumigo-cdk2-alpha';
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

### W3C TraceContext propagation in AWS Lambda

To be able to trace scenarios in which a Lambda function sends HTTP requests to an application instrumented with OpenTelemetry, like those using the [Lumigo OpenTelemetry Distro for JS](https://github.com/lumigo-io/opentelemetry-js-distro) and [Lumigo OpenTelemetry Distro for Python](https://github.com/lumigo-io/opentelemetry-python-distro) or other OpenTelemetry SDKs, the Lumigo Node.js and Python tracers can optionally add [W3C TraceContext](https://www.w3.org/TR/trace-context/) HTTP headers to outgoing requests.

Aty the tracer level, the support of W3C TraceContext is currently opt-in via the `LUMIGO_PROPAGATE_W3C=true` environment variable.
But the Lumigo CDK integration can apply it to all your Lambda functions:

```typescript
import { Lumigo } from 'lumigo-cdk2-alpha';
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

## Supported Constructs

The Lumigo CDK integration applies autotrace to the following constructs by adding a Lambda layer containing the right tracer for the Lambda function runtime, and environment variables:

* [`Function`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda.Function.html) from the [`aws-cdk-lib/aws-lambda`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda-readme.html) package.
* [`NodejsFunction`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_nodejs.NodejsFunction.html) from the [`aws-cdk-lib/aws-lambda-nodejs`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_nodejs-readme.html) package.
* [`PythonFunction`](https://docs.aws.amazon.com/cdk/api/v2/docs/@aws-cdk_aws-lambda-python-alpha.PythonFunction.html) from the [`@aws-cdk/aws-lambda-python-alpha`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-lambda-python-alpha-readme.html) package.
