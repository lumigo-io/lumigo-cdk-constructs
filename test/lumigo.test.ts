import { Lumigo } from '../src';
import { App, SecretValue, Stack, StackProps } from 'aws-cdk-lib';
import { Function, InlineCode, LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export class NodejsTestStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    new Function(this, 'MyLambda', {
      code: new InlineCode('foo'),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
  }
}

export class PythonTestStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    new Function(this, 'MyLambda', {
      code: new InlineCode('foo'),
      handler: 'index.handler',
      runtime: Runtime.PYTHON_3_9,
    });
  }
}

interface LumigoStackProps extends StackProps {
  readonly lumigo: Lumigo;
}

export class NodejsTestSingleLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props: LumigoStackProps) {
    super(scope, id, props);

    const handler = new Function(this, 'MyLambda', {
      code: new InlineCode('foo'),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });

    props.lumigo.traceLambda(handler);
  }
}

export class PythonTestSingleLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props: LumigoStackProps) {
    super(scope, id, props);

    const handler = new Function(this, 'MyLambda', {
      code: new InlineCode('foo'),
      handler: 'index.handler',
      runtime: Runtime.PYTHON_3_9,
    });

    props.lumigo.traceLambda(handler);
  }
}

export class NodejsTestOverrideAwsLambdaExecWrapperEnvVarsStack extends Stack {
  constructor(scope: Construct, id: string, props: LumigoStackProps) {
    super(scope, id, props);

    const handler = new Function(this, 'MyLambda', {
      code: new InlineCode('foo'),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });

    props.lumigo.traceLambda(handler);

    handler.addEnvironment('AWS_LAMBDA_EXEC_WRAPPER', '');
  }
}

export class NodejsTestOverrideLumigoTracerTokenWrapperEnvVarsStack extends Stack {
  constructor(scope: Construct, id: string, props: LumigoStackProps) {
    super(scope, id, props);

    const handler = new Function(this, 'MyLambda', {
      code: new InlineCode('foo'),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });

    props.lumigo.traceLambda(handler);

    handler.addEnvironment('LUMIGO_TRACER_TOKEN', '');
  }
}

export class NodejsTestOverrideLumigoLayerStack extends Stack {
  constructor(scope: Construct, id: string, props: LumigoStackProps) {
    super(scope, id, props);

    const handler = new Function(this, 'MyLambda', {
      code: new InlineCode('foo'),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });

    props.lumigo.traceLambda(handler);

    handler.addLayers(LayerVersion.fromLayerVersionArn(handler, 'AdditionaLayer', `arn:aws:lambda:${handler.env.region!}:114300393969:layer:000`));
  }
}

describe('Lambda tracing injection', () => {

  describe('with Lumigo as aspect to the entire application containing', () => {

    test('a Node.js function', () => {
      const app = new App();

      new Lumigo({lumigoToken:SecretValue.secretsManager('LumigoToken')}).traceEverything(app);

      const root = new NodejsTestStack(app, 'NodejsTestStack', {
        env: {
          region: 'eu-central-1',
        }
      });

      app.synth();

      expect(root.node.children[0]).toBeInstanceOf(Function);
      const f = root.node.children[0] as Function;

      expect(f._layers).toHaveLength(1);
      expect(f._layers[0].layerVersionArn.startsWith('arn:aws:lambda:eu-central-1:114300393969:layer:lumigo-node-tracer:'));

      expect(f['environment']['AWS_LAMBDA_EXEC_WRAPPER']).toEqual({
        'value': '/opt/lumigo_wrapper'
      });
      expect(f['environment']['LUMIGO_TRACER_TOKEN']).not.toBeNull();
    });

    test('an already-traced Node.js function', () => {
      const app = new App();
      const lumigo = new Lumigo({ lumigoToken: SecretValue.secretsManager('LumigoToken') });

      lumigo.traceEverything(app);

      new NodejsTestSingleLambdaStack(app, 'NodejsTestStack', {
        env: {
          region: 'eu-central-1',
        },
        lumigo,
      });

      expect(() => {
        app.synth();
      }).toThrowError(/There is already a Construct with name 'LumigoLayer' in Function/);
    });

    test('a Python function', () => {
      const app = new App();

      new Lumigo({lumigoToken:SecretValue.secretsManager('LumigoToken')}).traceEverything(app);

      const root = new PythonTestStack(app, 'PythonTestStack', {
        env: {
          region: 'eu-central-1',
        }
      });

      app.synth();

      expect(root.node.children[0]).toBeInstanceOf(Function);
      const f = root.node.children[0] as Function;

      expect(f._layers).toHaveLength(1);
      expect(f._layers[0].layerVersionArn.startsWith('arn:aws:lambda:eu-central-1:114300393969:layer:lumigo-python-tracer:'));

      expect(f['environment']['LUMIGO_TRACER_TOKEN']).not.toBeNull();
    });

    test('an already-traced Python function', () => {
      const app = new App();

      const lumigo = new Lumigo({ lumigoToken: SecretValue.secretsManager('LumigoToken') });

      lumigo.traceEverything(app);

      new PythonTestSingleLambdaStack(app, 'PythonTestStack', {
        env: {
          region: 'eu-central-1',
        },
        lumigo,
      });

      expect(() => {
        app.synth();
      }).toThrowError(/There is already a Construct with name 'LumigoLayer' in Function/);
    });

  });

  describe('with Lumigo as aspect to a stack containing', () => {

    const lumigo = new Lumigo({lumigoToken:SecretValue.secretsManager('LumigoToken')});

    test('a single Node.js function', () => {
      const app = new App();

      const root = new NodejsTestSingleLambdaStack(app, 'NodejsTestStack', {
        env: {
          region: 'eu-central-1',
        },
        lumigo,
      });

      app.synth();

      expect(root.node.children[0]).toBeInstanceOf(Function);
      const f = root.node.children[0] as Function;

      expect(f._layers).toHaveLength(1);
      expect(f._layers[0].layerVersionArn.startsWith('arn:aws:lambda:eu-central-1:114300393969:layer:lumigo-node-tracer:'));

      expect(f['environment']['AWS_LAMBDA_EXEC_WRAPPER']).toEqual({
        'value': '/opt/lumigo_wrapper'
      });
      expect(f['environment']['LUMIGO_TRACER_TOKEN']).not.toBeNull();
    });

    test('a single Python function', () => {
      const app = new App();

      const root = new PythonTestSingleLambdaStack(app, 'PythonTestStack', {
        env: {
          region: 'eu-central-1',
        },
        lumigo,
      });

      app.synth();

      expect(root.node.children[0]).toBeInstanceOf(Function);
      const f = root.node.children[0] as Function;

      expect(f._layers).toHaveLength(1);
      expect(f._layers[0].layerVersionArn.startsWith('arn:aws:lambda:eu-central-1:114300393969:layer:lumigo-python-tracer:'));

      expect(f['environment']['LUMIGO_TRACER_TOKEN']).not.toBeNull();
    });

  });

  describe('with a function environment overriding', () => {

    test('the Lumigo layer', () => {
      const app = new App();

      const lumigo = new Lumigo({ lumigoToken: SecretValue.secretsManager('LumigoToken') });

      new NodejsTestOverrideLumigoLayerStack(app, 'NodejsTestStack', {
        env: {
          region: 'eu-central-1',
        },
        lumigo,
      });

      expect(() => {
        app.synth();
      }).toThrowError(/Multiple Lumigo layers found: 'arn:aws:lambda:eu-central-1:114300393969:layer:lumigo-node-tracer:\d+','arn:aws:lambda:eu-central-1:114300393969:layer:000'/);
    });

    test('the AWS_LAMBDA_EXEC_WRAPPER env var', () => {
      const app = new App();

      const lumigo = new Lumigo({ lumigoToken: SecretValue.secretsManager('LumigoToken') });

      new NodejsTestOverrideAwsLambdaExecWrapperEnvVarsStack(app, 'NodejsTestStack', {
        env: {
          region: 'eu-central-1',
        },
        lumigo,
      });

      expect(() => {
        app.synth();
      }).toThrowError(/The 'AWS_LAMBDA_EXEC_WRAPPER' environment variable has a different value than the expected '\/opt\/lumigo_wrapper'/);
    });
  
    test('the LUMIGO_TRACER_TOKEN env var', () => {
      const app = new App();

      const lumigo = new Lumigo({ lumigoToken: SecretValue.secretsManager('LumigoToken') });

      new NodejsTestOverrideLumigoTracerTokenWrapperEnvVarsStack(app, 'NodejsTestStack', {
        env: {
          region: 'eu-central-1',
        },
        lumigo,
      });

      expect(() => {
        app.synth();
      }).toThrowError(/The 'LUMIGO_TRACER_TOKEN' environment variable has a blank value/);
    });

  });

});
