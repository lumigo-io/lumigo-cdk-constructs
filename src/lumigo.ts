import { dirname, join } from 'path';
import { PythonFunction } from '@aws-cdk/aws-lambda-python-alpha';
import { App, Annotations, IAspect, SecretValue, Stack, Aspects, Tags } from 'aws-cdk-lib';
import { Function, LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { IConstruct, IValidation } from 'constructs';

/* eslint-disable */
const { name, version } = require(join(dirname(__dirname), 'package.json'));
/* eslint-enable */

import * as lambdaLayersNodejs from './lambda_layers_nodejs.json';
import * as lambdaLayersPython from './lambda_layers_python.json';

type SupportedFunction = Function | NodejsFunction | PythonFunction;

export interface LumigoProps {
  readonly lumigoToken: SecretValue;
}

export interface LumigoAspectProps {
  readonly lambdaNodejsLayerVersion?: Number;
  readonly lambdaPythonLayerVersion?: Number;
  readonly lambdaEnableW3CTraceContext?: Boolean;
}

export interface TraceLambdaProps {
  readonly layerVersion?: Number;
  readonly enableW3CTraceContext?: Boolean;
}

// Layer type to layer name
enum LambdaLayerType {
  NODE = 'lumigo-node-tracer',
  PYTHON = 'lumigo-python-tracer',
}

const AWS_LAMBDA_EXEC_WRAPPER_ENV_VAR_NAME = 'AWS_LAMBDA_EXEC_WRAPPER';

const AWS_LAMBDA_EXEC_WRAPPER_ENV_VAR_VALUE = '/opt/lumigo_wrapper';

const LUMIGO_PROPAGATE_W3C_ENV_VAR_NAME = 'LUMIGO_PROPAGATE_W3C';

const LUMIGO_TRACER_TOKEN_ENV_VAR_NAME = 'LUMIGO_TRACER_TOKEN';

/**
 * TODO: Document tracing functions one-by-one
 * TODO: Document using as Aspect to trace all functions
 */
export class Lumigo {

  props: LumigoProps;

  constructor(props: LumigoProps) {
    this.props = props;
  }

  public visit(construct: IConstruct): void {
    if (construct instanceof Function) {
      try {
        this.traceLambda(construct);
      } catch (e) {
        if (e instanceof UnsupportedLambdaRuntimeError) {
          this.info(construct, `The '${e.unsupportedRuntime}' cannot be automatically traced by Lumigo.`);
        } else {
          throw e;
        }
      }
    }
  }

  protected info(node: IConstruct, message: string): void {
    Annotations.of(node).addInfo(message);
  }

  protected error(node: IConstruct, message: string): void {
    Annotations.of(node).addError(message);
  }

  protected warning(node: IConstruct, message: string): void {
    Annotations.of(node).addWarning(message);
  }

  public traceEverything(root: App | Stack, props: LumigoAspectProps = {}) {
    Aspects.of(root).add(this.asAspect(props));
  }

  public asAspect(props: LumigoAspectProps): IAspect {
    const lumigo = this;
    return <IAspect>{
      visit: function(construct: IConstruct): void {
        if (construct instanceof Function) {
          try {
            const layerType = lumigo.getLayerType(construct);

            var layerVersion;
            if (layerType === LambdaLayerType.NODE) {
              layerVersion = props.lambdaNodejsLayerVersion;
            } else if (layerType === LambdaLayerType.PYTHON) {
              layerVersion = props.lambdaPythonLayerVersion;
            }

            lumigo.traceLambda(construct, {
              layerVersion,
              enableW3CTraceContext: props.lambdaEnableW3CTraceContext === true,
            });
          } catch (e) {
            if (e instanceof UnsupportedLambdaRuntimeError) {
              lumigo.info(construct, `The '${e.unsupportedRuntime}' cannot be automatically traced by Lumigo.`);
            } else {
              throw e;
            }
          }
        }
      },
    };
  }

  public traceLambda(lambda: SupportedFunction, props: TraceLambdaProps = {}) {
    // TODO Add warning old layer
    const layerType = this.getLayerType(lambda);

    const region = Stack.of(lambda).region;

    const layerVersion = props.layerVersion || this.getLayerLatestVersion(region, layerType);

    lambda.addLayers(LayerVersion.fromLayerVersionArn(lambda, 'LumigoLayer', `arn:aws:lambda:${region}:114300393969:layer:${layerType}:${layerVersion}`));
    lambda.addEnvironment(LUMIGO_TRACER_TOKEN_ENV_VAR_NAME, this.props.lumigoToken.toString());

    lambda.node.addValidation(new HasExactlyOneLumigoLayerValidation(lambda));
    lambda.node.addValidation(new HasLumigoTracerEnvVarValidation(lambda));

    if (layerType === LambdaLayerType.NODE) {
      lambda.addEnvironment(AWS_LAMBDA_EXEC_WRAPPER_ENV_VAR_NAME, AWS_LAMBDA_EXEC_WRAPPER_ENV_VAR_VALUE);

      lambda.node.addValidation(new HasAwsLambdaExecWrapperEnvVarValidation(lambda));
    }

    if (props.enableW3CTraceContext === true) {
      lambda.addEnvironment(LUMIGO_PROPAGATE_W3C_ENV_VAR_NAME, String(true));

      lambda.node.addValidation(new HasLumigoPropagateW3CEnvVarValidation(lambda));
    }

    Tags.of(lambda).add('lumigo:auto-trace', `${name}@${version}`);
    this.info(lambda, `This function has been modified with Lumigo auto-tracing by the '${name}@${version}' package.`);
  }

  private getLayerType(lambda: SupportedFunction): LambdaLayerType {
    switch (lambda.runtime) {
      case Runtime.NODEJS_10_X:
      case Runtime.NODEJS_12_X:
      case Runtime.NODEJS_14_X:
      case Runtime.NODEJS_16_X:
        return LambdaLayerType.NODE;
      case Runtime.PYTHON_3_7:
      case Runtime.PYTHON_3_8:
      case Runtime.PYTHON_3_9:
        return LambdaLayerType.PYTHON;
      default:
        throw new UnsupportedLambdaRuntimeError(lambda.runtime);
    }
  }

  private getLayerLatestVersion(region: string, type: LambdaLayerType): Number {
    const latestLayerVersionMap = (type === LambdaLayerType.NODE ? lambdaLayersNodejs : lambdaLayersPython);
    const latestLayerVersion = (new Map(Object.entries(latestLayerVersionMap))).get(region);

    if (!latestLayerVersion) {
      throw new UnsupportedLambdaLayerRegion(type, region);
    }

    return latestLayerVersion;
  }

}

class HasExactlyOneLumigoLayerValidation implements IValidation {

  private readonly lambda: SupportedFunction;

  constructor(lambda: SupportedFunction) {
    this.lambda = lambda;
  }

  public validate(): string[] {
    /* eslint-disable */
    const layers: LayerVersion[]  = (this.lambda as any)['layers'];
    /* eslint-enable */

    if (!layers) {
      return ['The function does not have the Lumigo layer installed.'];
    }

    const lumigoLayerArns = layers
      .filter(layer => layer.layerVersionArn.startsWith(`arn:aws:lambda:${this.lambda.env.region!}:114300393969:layer:`))
      .map(layer => layer.layerVersionArn);

    if (lumigoLayerArns.length > 1) {
      return [`Multiple Lumigo layers found: ${lumigoLayerArns.map(arn => `'${arn}'`)}`];
    }

    return [];
  }

}

class HasLumigoTracerEnvVarValidation implements IValidation {

  private readonly lambda: SupportedFunction;

  constructor(lambda: SupportedFunction) {
    this.lambda = lambda;
  }

  public validate(): string[] {
    /* eslint-disable */
    const environment = this.lambda['environment'];
    /* eslint-enable */

    if (!environment) {
      return ['No \'environment\' property found on this Lambda; consider upgrading your \'@lumigo/cdk2\' package.'];
    }

    if (!environment[LUMIGO_TRACER_TOKEN_ENV_VAR_NAME]) {
      return [`The '${LUMIGO_TRACER_TOKEN_ENV_VAR_NAME}' environment variable is not set.`];
    }

    const {
      'value': value,
    } = environment[LUMIGO_TRACER_TOKEN_ENV_VAR_NAME];

    if (!value) {
      return [`The '${LUMIGO_TRACER_TOKEN_ENV_VAR_NAME}' environment variable has a blank value.`];
    }

    return [];
  }

}

class HasAwsLambdaExecWrapperEnvVarValidation implements IValidation {

  private readonly lambda: SupportedFunction;

  constructor(lambda: SupportedFunction) {
    this.lambda = lambda;
  }

  public validate(): string[] {
    /* eslint-disable */
    const environment = this.lambda['environment'];
    /* eslint-enable */

    if (!environment) {
      return ['No \'environment\' property found on this Lambda; consider upgrading your \'@lumigo/cdk2\' package.'];
    }

    if (!environment[AWS_LAMBDA_EXEC_WRAPPER_ENV_VAR_NAME]) {
      return [`The '${AWS_LAMBDA_EXEC_WRAPPER_ENV_VAR_NAME}' environment variable is not set.`];
    }

    const {
      'value': value,
    } = environment[AWS_LAMBDA_EXEC_WRAPPER_ENV_VAR_NAME];

    if (value !== AWS_LAMBDA_EXEC_WRAPPER_ENV_VAR_VALUE) {
      return [`The '${AWS_LAMBDA_EXEC_WRAPPER_ENV_VAR_NAME}' environment variable has a different value than the expected '${AWS_LAMBDA_EXEC_WRAPPER_ENV_VAR_VALUE}'.`];
    }

    return [];
  }

}

class HasLumigoPropagateW3CEnvVarValidation implements IValidation {

  private readonly lambda: SupportedFunction;

  constructor(lambda: SupportedFunction) {
    this.lambda = lambda;
  }

  public validate(): string[] {
    /* eslint-disable */
    const environment = this.lambda['environment'];
    /* eslint-enable */

    if (!environment) {
      return ['No \'environment\' property found on this Lambda; consider upgrading your \'@lumigo/cdk2\' package.'];
    }

    if (!environment[LUMIGO_PROPAGATE_W3C_ENV_VAR_NAME]) {
      return [`The '${LUMIGO_PROPAGATE_W3C_ENV_VAR_NAME}' environment variable is not set.`];
    }

    const {
      'value': value,
    } = environment[LUMIGO_PROPAGATE_W3C_ENV_VAR_NAME];

    if (value !== 'true') {
      return [`The '${LUMIGO_PROPAGATE_W3C_ENV_VAR_NAME}' environment variable has a different value than the expected 'true'.`];
    }

    return [];
  }

}

class UnsupportedLambdaRuntimeError extends Error {

  readonly unsupportedRuntime: Runtime;

  constructor(unsupportedRuntime: Runtime) {
    super(`The '${unsupportedRuntime}' runtime is not supported.`);

    this.unsupportedRuntime = unsupportedRuntime;
  }

}

class UnsupportedLambdaLayerRegion extends Error {

  readonly unsupportedRegion: String;

  readonly unsupportedType: LambdaLayerType;

  constructor(unsupportedType: LambdaLayerType, unsupportedRegion: String) {
    super(`The '${unsupportedType}' layer is not supported in the '${unsupportedRegion}' region.`);

    this.unsupportedRegion = unsupportedRegion;
    this.unsupportedType = unsupportedType;
  }

}
