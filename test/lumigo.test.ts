import './matchers/custom-matchers';
import { App, SecretValue, Stack, StackProps } from 'aws-cdk-lib';
import { Alias, Function, InlineCode, LayerVersion, Runtime, SingletonFunction } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { Lumigo } from '../src';


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

interface PythonTestStackProps extends StackProps {
  readonly handler?: string;
}

export class PythonTestStack extends Stack {
  constructor(scope: Construct, id: string, props: PythonTestStackProps = {}) {
    super(scope, id, props);

    new Function(this, 'MyLambda', {
      code: new InlineCode('foo'),
      handler: props.handler || 'index.handler',
      runtime: Runtime.PYTHON_3_9,
    });
  }
}

export class NodejsAliasTestStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const func = new Function(this, 'MyLambda', {
      code: new InlineCode('foo'),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });

    const version = func.currentVersion;
    new Alias(this, 'MyLambdaAlias', {
      aliasName: 'Alias1',
      provisionedConcurrentExecutions: 42,
      version,
    });
  }
}

export class SingletonFunctionTestStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    new SingletonFunction(this, 'MyLambda1', {
      uuid: 'af5f3e05-4361-4f78-bb0d-87198da1af99',
      code: new InlineCode('foo'),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });

    new SingletonFunction(this, 'MyLambda2', {
      uuid: 'af5f3e05-4361-4f78-bb0d-87198da1af99',
      code: new InlineCode('foo'),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
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

export class NodejsTestSingleLambdaPinnedLayerVersionStack extends Stack {
  constructor(scope: Construct, id: string, props: LumigoStackProps) {
    super(scope, id, props);

    const handler = new Function(this, 'MyLambda', {
      code: new InlineCode('foo'),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });

    props.lumigo.traceLambda(handler, {
      layerVersion: 42,
    });
  }
}

export class PythonTestSingleLambdaPinnedLayerVersionStack extends Stack {
  constructor(scope: Construct, id: string, props: LumigoStackProps) {
    super(scope, id, props);

    const handler = new Function(this, 'MyLambda', {
      code: new InlineCode('foo'),
      handler: 'index.handler',
      runtime: Runtime.PYTHON_3_9,
    });

    props.lumigo.traceLambda(handler, {
      layerVersion: 42,
    });
  }
}

describe('Lambda tracing injection', () => {

  describe('with Lumigo as aspect to the entire application', () => {

    describe('using W3C TraceContext propagation with', () => {

      test('a Node.js function', () => {
        const app = new App();

        new Lumigo({ lumigoToken: SecretValue.secretsManager('LumigoToken') }).traceEverything(app, {
          lambdaEnableW3CTraceContext: true,
        });

        const root = new NodejsTestStack(app, 'NodejsTestStack', {
          env: {
            region: 'eu-central-1',
          },
        });

        app.synth();

        expect(root.node.children[0]).toBeInstanceOf(Function);
        const f = root.node.children[0] as Function;

        expect(f).toHaveLumigoLayerInRegion({
          region: 'eu-central-1', name: 'lumigo-node-tracer',
        });
        expect(f).toHaveEnvVarWithValue('AWS_LAMBDA_EXEC_WRAPPER', '/opt/lumigo_wrapper');
        expect(f).toHaveEnvVarWithValue('LUMIGO_PROPAGATE_W3C', 'true');
        expect(f).toHaveEnvVarSet('LUMIGO_TRACER_TOKEN');
      });

      describe('a Python function', () => {

        test('with default handler', () => {
          const app = new App();

          new Lumigo({ lumigoToken: SecretValue.secretsManager('LumigoToken') }).traceEverything(app, {
            lambdaEnableW3CTraceContext: true,
          });

          const root = new PythonTestStack(app, 'PythonTestStack', {
            env: {
              region: 'eu-central-1',
            },
          });

          app.synth();

          expect(root.node.children[0]).toBeInstanceOf(Function);
          const f = root.node.children[0] as Function;

          expect(f).toHaveLumigoLayerInRegion({
            region: 'eu-central-1', name: 'lumigo-python-tracer',
          });
          expect(f).toHaveEnvVarWithValue('LUMIGO_PROPAGATE_W3C', 'true');
          expect(f).toHaveEnvVarSet('LUMIGO_TRACER_TOKEN');
          expect(f).toHaveEnvVarWithValue('LUMIGO_ORIGINAL_HANDLER', 'index.handler');
        });

        test('with custom handler', () => {
          const app = new App();

          new Lumigo({ lumigoToken: SecretValue.secretsManager('LumigoToken') }).traceEverything(app, {
            lambdaEnableW3CTraceContext: true,
          });

          const root = new PythonTestStack(app, 'PythonTestStack', {
            env: {
              region: 'eu-central-1',
            },
            handler: 'foo.handler',
          });

          app.synth();

          expect(root.node.children[0]).toBeInstanceOf(Function);
          const f = root.node.children[0] as Function;

          expect(f).toHaveLumigoLayerInRegion({
            region: 'eu-central-1', name: 'lumigo-python-tracer',
          });
          expect(f).toHaveEnvVarWithValue('LUMIGO_PROPAGATE_W3C', 'true');
          expect(f).toHaveEnvVarSet('LUMIGO_TRACER_TOKEN');
          expect(f).toHaveEnvVarWithValue('LUMIGO_ORIGINAL_HANDLER', 'foo.handler');
        });

      });

    });

    describe('using the pinned layers with', () => {

      test('a Node.js function', () => {
        const app = new App();

        new Lumigo({ lumigoToken: SecretValue.secretsManager('LumigoToken') }).traceEverything(app, {
          lambdaNodejsLayerVersion: 1,
        });

        const root = new NodejsTestStack(app, 'NodejsTestStack', {
          env: {
            region: 'eu-central-1',
          },
        });

        app.synth();

        expect(root.node.children[0]).toBeInstanceOf(Function);
        const f = root.node.children[0] as Function;

        expect(f).toHaveLumigoLayerInRegionWithVersion({
          region: 'eu-central-1', name: 'lumigo-node-tracer', version: '1',
        });
        expect(f).toHaveEnvVarWithValue('AWS_LAMBDA_EXEC_WRAPPER', '/opt/lumigo_wrapper');
        expect(f).toHaveEnvVarSet('LUMIGO_TRACER_TOKEN');
      });

      test('a Python function', () => {
        const app = new App();

        new Lumigo({ lumigoToken: SecretValue.secretsManager('LumigoToken') }).traceEverything(app, {
          lambdaPythonLayerVersion: 1,
        });

        const root = new PythonTestStack(app, 'PythonTestStack', {
          env: {
            region: 'eu-central-1',
          },
        });

        app.synth();

        expect(root.node.children[0]).toBeInstanceOf(Function);
        const f = root.node.children[0] as Function;

        expect(f).toHaveLumigoLayerInRegionWithVersion({
          region: 'eu-central-1', name: 'lumigo-python-tracer', version: '1',
        });
        expect(f).toHaveEnvVarSet('LUMIGO_TRACER_TOKEN');
        expect(f).toHaveEnvVarWithValue('LUMIGO_ORIGINAL_HANDLER', 'index.handler');
      });

    });

    describe('using the latest layers with', () => {

      test('a Node.js function', () => {
        const app = new App();

        new Lumigo({ lumigoToken: SecretValue.secretsManager('LumigoToken') }).traceEverything(app);

        const root = new NodejsTestStack(app, 'NodejsTestStack', {
          env: {
            region: 'eu-central-1',
          },
        });

        app.synth();

        expect(root.node.children[0]).toBeInstanceOf(Function);
        const f = root.node.children[0] as Function;

        expect(f).toHaveLumigoLayerInRegion({
          region: 'eu-central-1', name: 'lumigo-node-tracer',
        });
        expect(f).toHaveEnvVarWithValue('AWS_LAMBDA_EXEC_WRAPPER', '/opt/lumigo_wrapper');
        expect(f).toHaveEnvVarSet('LUMIGO_TRACER_TOKEN');
      });

      test('a Node.js function with an Alias', () => {
        const app = new App();

        new Lumigo({ lumigoToken: SecretValue.secretsManager('LumigoToken') }).traceEverything(app);

        const root = new NodejsAliasTestStack(app, 'NodejsTestStack', {
          env: {
            region: 'eu-central-1',
          },
        });

        app.synth();

        expect(root.node.children[0]).toBeInstanceOf(Function);
        const f = root.node.children[0] as Function;

        expect(f).toHaveLumigoLayerInRegion({
          region: 'eu-central-1', name: 'lumigo-node-tracer',
        });
        expect(f).toHaveEnvVarWithValue('AWS_LAMBDA_EXEC_WRAPPER', '/opt/lumigo_wrapper');
        expect(f).toHaveEnvVarSet('LUMIGO_TRACER_TOKEN');
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

        new Lumigo({ lumigoToken: SecretValue.secretsManager('LumigoToken') }).traceEverything(app);

        const root = new PythonTestStack(app, 'PythonTestStack', {
          env: {
            region: 'eu-central-1',
          },
        });

        app.synth();

        expect(root.node.children[0]).toBeInstanceOf(Function);
        const f = root.node.children[0] as Function;

        expect(f).toHaveLumigoLayerInRegion({
          region: 'eu-central-1', name: 'lumigo-python-tracer',
        });
        expect(f).toHaveEnvVarSet('LUMIGO_TRACER_TOKEN');
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

  });

  describe('with Lumigo as aspect to a stack containing', () => {

    const lumigo = new Lumigo({ lumigoToken: SecretValue.secretsManager('LumigoToken') });

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

      expect(f).toHaveLumigoLayerInRegion({
        region: 'eu-central-1',
        name: 'lumigo-node-tracer',
      });
      expect(f).toHaveEnvVarWithValue('AWS_LAMBDA_EXEC_WRAPPER', '/opt/lumigo_wrapper');
      expect(f).toHaveEnvVarSet('LUMIGO_TRACER_TOKEN');
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

      expect(f).toHaveLumigoLayerInRegion({
        region: 'eu-central-1', name: 'lumigo-python-tracer',
      });
      expect(f).toHaveEnvVarSet('LUMIGO_TRACER_TOKEN');
    });

    test('a single Node.js function with layer version pinning', () => {
      const app = new App();

      const root = new NodejsTestSingleLambdaPinnedLayerVersionStack(app, 'NodejsTestStack', {
        env: {
          region: 'eu-central-1',
        },
        lumigo,
      });

      app.synth();

      expect(root.node.children[0]).toBeInstanceOf(Function);
      const f = root.node.children[0] as Function;

      expect(f).toHaveLumigoLayerInRegionWithVersion({
        region: 'eu-central-1', name: 'lumigo-node-tracer', version: '42',
      });
      expect(f).toHaveEnvVarWithValue('AWS_LAMBDA_EXEC_WRAPPER', '/opt/lumigo_wrapper');
      expect(f).toHaveEnvVarSet('LUMIGO_TRACER_TOKEN');
    });

    test('a single Python function with layer version pinning', () => {
      const app = new App();

      const root = new PythonTestSingleLambdaPinnedLayerVersionStack(app, 'PythonTestStack', {
        env: {
          region: 'eu-central-1',
        },
        lumigo,
      });

      app.synth();

      expect(root.node.children[0]).toBeInstanceOf(Function);
      const f = root.node.children[0] as Function;

      expect(f).toHaveLumigoLayerInRegionWithVersion({
        region: 'eu-central-1', name: 'lumigo-python-tracer', version: '42',
      });
      expect(f).toHaveEnvVarSet('LUMIGO_TRACER_TOKEN');
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
