# Lumigo CDK Integrations

This repository provides means of adding Lumigo tracing as "infrastructure-as-code" to Lambda functions deployed via the [AWS Cloud Development Kit (CDK) v2](https://docs.aws.amazon.com/cdk/api/v2/).

If instead of the AWS CDK v2, you are using the [Serverless Framework](https://www.serverless.com/), refer to the [`serverless-lumigo` plugin](https://github.com/lumigo-io/serverless-lumigo-plugin) documentation.

## Installation

### TypeScript / JavaScript

With `yarn`:

```sh
yarn install '@lumigo/cdk2'
```

With `npm`:

```sh
npm install '@lumigo/cdk2'
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
import { Lumigo } from '@lumigo/cdk2';
import { App, SecretValue } from 'aws-cdk-lib';

const app = new App();

// Add here stacks and constructs

new Lumigo({lumigoToken:SecretValue.secretsManager('LumigoToken')}).traceEverything(app);

app.synth();
```

The `Lumigo.traceEverything` functionality is built using CDK [Aspects](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.Aspects.html), which can also be used directly as follows:

```typescript
import { Lumigo } from '@lumigo/cdk2';
import { App, Aspects. SecretValue } from 'aws-cdk-lib';

const app = new App();

// Add here stacks and constructs

Aspects.of(app).add(new Lumigo({lumigoToken:SecretValue.secretsManager('LumigoToken')}));

app.synth();
```

### Instrumenting a CDK stack

The following code will apply Lumigo autotracing to all the [supported constructs](#supported-constructs) in the instrumented stack:

```typescript
import { Lumigo } from '@lumigo/cdk2';
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
import { Lumigo } from '@lumigo/cdk2';
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


## Supported Constructs

The Lumigo CDK integration applies autotrace to the following constructs by adding a Lambda layer containing the right tracer for the Lambda function runtime, and environment variables:

* [`Function`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda.Function.html) from the [`aws-cdk-lib/aws-lambda`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda-readme.html) package
* [`NodejsFunction`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_nodejs.NodejsFunction.html) from the [`aws-cdk-lib/aws-lambda-nodejs`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_nodejs-readme.html) package
* [`PythonFunction`](https://docs.aws.amazon.com/cdk/api/v2/docs/@aws-cdk_aws-lambda-python-alpha.PythonFunction.html) from the [`@aws-cdk/aws-lambda-python-alpha`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-lambda-python-alpha-readme.html) package