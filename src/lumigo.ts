import { dirname, join } from 'path';

/*
 * We really only need the type, not the code. By using `import type`,
 * we do not need the dependency at runtime.
 */
import type { PythonFunction } from '@aws-cdk/aws-lambda-python-alpha';

import { App, Annotations, IAspect, SecretValue, Stack, Aspects, Tags, TagManager, CfnDynamicReference, CfnDynamicReferenceService } from 'aws-cdk-lib';
import {
  CfnTaskDefinition,
  ContainerDefinition,
  ContainerDependencyCondition,
  ContainerImage,
  Ec2Service,
  Ec2TaskDefinition,
  FargateService,
  FargateTaskDefinition,
  ITaskDefinitionExtension,
  Secret,
  TaskDefinition,
  Volume,
} from 'aws-cdk-lib/aws-ecs';
import {
  ApplicationLoadBalancedEc2Service,
  ApplicationLoadBalancedFargateService,
  ApplicationMultipleTargetGroupsEc2Service,
  ApplicationMultipleTargetGroupsFargateService,
  NetworkLoadBalancedEc2Service,
  NetworkLoadBalancedFargateService,
  NetworkMultipleTargetGroupsEc2Service,
  NetworkMultipleTargetGroupsFargateService,
  QueueProcessingEc2Service,
  QueueProcessingFargateService,
  ScheduledEc2Task,
  ScheduledFargateTask,
} from 'aws-cdk-lib/aws-ecs-patterns';
import { Function, LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Secret as SecretManagerSecret } from 'aws-cdk-lib/aws-secretsmanager';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct, IConstruct, IValidation } from 'constructs';

/* eslint-disable */
const { name, version } = require(join(dirname(__dirname), 'package.json'));
/* eslint-enable */

import * as lambdaLayersNodejs from './lambda_layers_nodejs.json';
import * as lambdaLayersPython from './lambda_layers_python.json';
import { image as lumigo_autotrace_image } from './lumigo_autotrace_image.json';

export const DEFAULT_LUMIGO_INJECTOR_IMAGE_NAME = lumigo_autotrace_image;

type SupportedLambdaFunction = (
  Function |
  NodejsFunction |
  PythonFunction
);

type SupportedEcsTaskDefinition = (
  Ec2TaskDefinition |
  FargateTaskDefinition
);

type SupportedEcsScheduledTask = (
  ScheduledEc2Task |
  ScheduledFargateTask
);

type SupportedEcsPatternsService = (
  ApplicationLoadBalancedEc2Service |
  ApplicationLoadBalancedFargateService |
  ApplicationMultipleTargetGroupsEc2Service |
  ApplicationMultipleTargetGroupsFargateService |
  NetworkLoadBalancedEc2Service |
  NetworkLoadBalancedFargateService |
  NetworkMultipleTargetGroupsEc2Service |
  NetworkMultipleTargetGroupsFargateService |
  QueueProcessingEc2Service |
  QueueProcessingFargateService
);

type SupportedEcsService = (
  FargateService |
  Ec2Service |
  SupportedEcsPatternsService
);

export interface LumigoProps {

  /**
   * A reference to a secret containing of the Lumigo token of the Lumigo project to be used with instrumented Lambda functions and ECS workloads.
   * Instructions on how to retrieve your Lumigo token are available in the [Lumigo tokens](https://docs.lumigo.io/docs/tags) documentation.
   * For more information concerning how AWS CDK 2 handles secrets, consult the [AWS SDK `SecretValue`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.SecretValue.html) documentation.
   */
  readonly lumigoToken: SecretValue;

}

interface CommonTraceProps {

  /**
   * Which Lumigo tag to apply to your instrumented Lambda functions and ECS workloads.
   * Lumigo Tags add dimension to your Lambda functions so that they can be identified, managed, organized, searched for, and filtered in Lumigo.
   * For more information on Lumigo tags, refer to the [Lumigo tokens](https://docs.lumigo.io/docs/tags) documentation.
   */
  readonly lumigoTag?: string;

  /**
   * Whether the Lumigo CDK constructs should automatically add the `lumigo:auto-trace` AWS tag with the version of the construct in use.
   * @default true
   */
  readonly applyAutoTraceTag?: boolean;

}

export interface LumigoTraceProps extends CommonTraceProps, CommonTraceEcsProps {

  /**
   * Whether to automatically trace all the Node.js and Python Lambda functions in this construct using [Lumigo Lambda auto-instrumentation](https://docs.lumigo.io/docs/auto-instrumentation).
   *
   * @default true
   */
  readonly traceLambda?: boolean;

  /**
   * Whether to automatically trace all the Java, Node.js and Python Lambda functions deployed on ECS by this construct using the respective [Lumigo OpenTelemetry distributions](https://docs.lumigo.io/docs/containerized-applications).
   *
   * @default true
   */
  readonly traceEcs?: boolean;

  /**
   * Which version of the `lumigo-node-tracer` AWS Lambda layer to be used when instrumenting AWS Lambda functions using a supported Node.js runtime.
   * Available layer versions depend on the AWS region your Lambda function is deployed in, see the [`lumigo-node-tracer` versions](https://github.com/lumigo-io/lumigo-node/tree/master/layers) list.
   * The default value is the latest Node.js layer at the time of release of this version of the Lumigo CDK constructs: [default Node.js versions](./src/lambda_layers_nodejs.json).
   */
  readonly lambdaNodejsLayerVersion?: number;

  /**
   * Which version of the `lumigo-python-tracer` AWS Lambda layer to be used when instrumenting AWS Lambda functions using a supported Python runtime.
   * Available layer versions depend on the AWS region your Lambda function is deployed in, see the [`lumigo-python-tracer` versions](https://github.com/lumigo-io/python_tracer/tree/master/layers) list.
   * The default value is the latest Python layer at the time of release of this version of the Lumigo CDK constructs: [default Python versions](./src/lambda_layers_python.json).
   */
  readonly lambdaPythonLayerVersion?: number;

  /**
   * Whether the Lumigo Lambda tracers will add the [W3C Trace Context](https://www.w3.org/TR/trace-context/) `traceparent` and `tracestate` HTTP headers to outgoing HTTP/HTTPS requests.
   * These headers are necessary to correctly correlate the HTTP requests from Lambda to workloads instrumented with the Lumigo OpenTelemetry distributions.
   * The only real case in which this property should be set to false, is if there is some HTTP request issued by the Lambda function that is going towards an API with request signature that is affected negatively by the additional headers.
   * If you encounter such an occurrence, please get in touch with [Lumigo's support](https://support.lumigo.io); we will issue an update to the Lumigo Lambda tracers to automatically not add [W3C Trace Context](https://www.w3.org/TR/trace-context/) to those APIs.
   *
   * @default true
   */
  readonly lambdaEnableW3CTraceContext?: boolean;

}

export interface TraceLambdaProps extends CommonTraceProps {

  /**
   * Which version of the appropriate Lumigo layer to be used; layer versions change based on runtime and region.
   * Layer versions: [Node.js](https://github.com/lumigo-io/lumigo-node/tree/master/layers) and [Python](https://github.com/lumigo-io/python_tracer/tree/master/layers).
   * The default value is the latest layers at the time of release of this version of the Lumigo CDK constructs: [default Node.js versions](./src/lambda_layers_nodejs.json), [default Python versions](./src/lambda_layers_python.json)
   */
  readonly layerVersion?: number;

  /**
   * Whether the Lumigo Lambda tracers will add the `traceparent` and `tracestate` [W3C Trace Context](https://www.w3.org/TR/trace-context/) headers to outgoing HTTP/HTTPS requests.
   * These headers are necessary to correctly correlate the HTTP requests from Lambda to workloads instrumented with the Lumigo OpenTelemetry distributions.
   * The only real case in which this property should be set to false, is if there is some HTTP request issued by the Lambda function that is going towards an API with request signature that is affected negatively by the additional headers.
   * If you encounter such an occurrence, please get in touch with [Lumigo's support](https://support.lumigo.io); we will issue an update to the Lumigo Lambda tracers to automatically not add [W3C Trace Context](https://www.w3.org/TR/trace-context/) to those APIs.
   *
   * @default true
   */
  readonly enableW3CTraceContext?: boolean;
}

interface CommonTraceEcsProps extends CommonTraceProps {

  /**
   * Which container image to use to instrument ECS workloads. Use a valid, full image name of the [`lumigo/lumigo-autotrace` image](https://gallery.ecr.aws/lumigo/lumigo-autotrace), e.g., `public.ecr.aws/lumigo/lumigo-autotrace:v14`.
   *
   * This property is exposed to support two use-cases: pinning a specific tag of the `lumigo/lumigo-autotrace` image, or supporting use-cases where Amazon ECS will not be able to pull from the Amazon ECS Public Gallery registry.
   * The available tags are listed on the [`lumigo/lumigo-autotrace` Amazon ECR Public Gallery](https://gallery.ecr.aws/lumigo/lumigo-autotrace) page.
   * The default value is the latest tag at the time of release of this version of the Lumigo CDK constructs: [default `lumigo/lumigo-autotrace` image](./src/lumigo_autotrace_image.json)
   */
  readonly lumigoAutoTraceImage?: string;

}

export interface TraceEcsTaskDefinitionProps extends CommonTraceEcsProps {
}

export interface TraceEcsScheduledTaskProps extends CommonTraceEcsProps {
}

export interface TraceEcsServiceProps extends CommonTraceEcsProps {
}

// Layer type to layer name
enum LambdaLayerType {
  NODE = 'lumigo-node-tracer',
  PYTHON = 'lumigo-python-tracer',
}

const AWS_LAMBDA_EXEC_WRAPPER_ENV_VAR_NAME = 'AWS_LAMBDA_EXEC_WRAPPER';

const AWS_LAMBDA_EXEC_WRAPPER_ENV_VAR_VALUE = '/opt/lumigo_wrapper';

const LUMIGO_ORIGINAL_HANDLER_ENV_VAR_NAME = 'LUMIGO_ORIGINAL_HANDLER';

const LUMIGO_PROPAGATE_W3C_ENV_VAR_NAME = 'LUMIGO_PROPAGATE_W3C';

const LUMIGO_TRACER_TOKEN_ENV_VAR_NAME = 'LUMIGO_TRACER_TOKEN';

const LUMIGO_AUTOTRACE_TAG_NAME = 'lumigo:auto-trace';

const LUMIGO_AUTOTRACE_TAG_VALUE = `${name}@${version}`;

const LUMIGO_TAG_TAG_NAME = 'LUMIGO_TAG';

const LUMIGO_LAMBDA_PYTHON_HANDLER = 'lumigo_tracer._handler';

const LUMIGO_INJECTOR_CONTAINER_NAME = 'lumigo-injector';

const LUMIGO_INJECTOR_VOLUME_NAME = 'lumigo-injector';

const LUMIGO_INJECTOR_VOLUME_MOUNT_POINT = '/opt/lumigo';

const LUMIGO_INJECTOR_ENV_VAR_NAME = 'LD_PRELOAD';

const LUMIGO_INJECTOR_ENV_VAR_VALUE = `${LUMIGO_INJECTOR_VOLUME_MOUNT_POINT}/injector/lumigo_injector.so`;

const DEFAULT_LUMIGO_TRACE_PROPS: LumigoTraceProps = {
  traceLambda: true,
  traceEcs: true,
  lambdaEnableW3CTraceContext: true,
};

const DEFAULT_TRACE_ECS_TASK_DEFINITION_PROPS: TraceEcsTaskDefinitionProps = {
  applyAutoTraceTag: true,
  lumigoAutoTraceImage: DEFAULT_LUMIGO_INJECTOR_IMAGE_NAME,
};

/**
 * The `Lumigo` class is the entry point for instrumenting workloads deployed via CDK constructs with Lumigo.
 * You usually would need only one instance of `Lumigo` per CDK application.
 */
export class Lumigo {

  props: LumigoProps;

  private ecsSecrets: Map<Construct, Secret> = new Map<Construct, Secret>();

  constructor(props: LumigoProps) {
    this.props = props;
  }

  /**
   * @private This is an internal API; it is not meant to be invoked directly by end-user code.
   */
  visit(construct: IConstruct): void {
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

  public traceEverything(root: App | Stack, props: LumigoTraceProps = DEFAULT_LUMIGO_TRACE_PROPS) {
    // For the people not using TypeScript, we need to perform some basic type validation
    assertExpectedConstructType('traceEverything', 'App', root, (c) => c instanceof App);

    Aspects.of(root).add(this.asAspect(props));
  }

  private asAspect(props: LumigoTraceProps = DEFAULT_LUMIGO_TRACE_PROPS): IAspect {
    const lumigo = this;
    /*
     * Tags are implemented as aspects in CDK, and unfortunately aspects like
     * this cannot apply other aspects.
     */
    const applyAutoTraceTag = false;

    return <IAspect>{
      visit: function(construct: IConstruct): void {
        function applyAwsTagThroughTagManager(key: string, value: string) {
          try {
            /**
             * To overcome the limitation that (1) tags are implemented as aspects, (2) that
             * we are already inside an aspect and (3) an aspect cannot add aspects, we need
             * to access the TagManager of the function and add the tag manually.
             */
            const scope = construct.node?.scope;
            if (!!scope) {
              /* eslint-disable */
              const tags = (scope as any)['tags'];
              /* eslint-enable */
              if (!!tags && tags instanceof TagManager) {
                tags.setTag(key, value, 100, true);
              }
            }
          } catch (e) {
            lumigo.warning(construct, `Cannot set the '${key}' tag with value '${value}'.`);
          }
        }

        if (construct instanceof Function && props.traceLambda !== false) {
          try {
            const layerType = lumigo.getLayerType(construct);
            if (!layerType) {
              lumigo.warning(construct, 'The runtime used by this function cannot be auto-traced by Lumigo.');
              return;
            }

            var layerVersion;
            if (layerType === LambdaLayerType.NODE) {
              layerVersion = props.lambdaNodejsLayerVersion;
            } else if (layerType === LambdaLayerType.PYTHON) {
              layerVersion = props.lambdaPythonLayerVersion;
            }

            lumigo.traceLambda(construct, {
              layerVersion,
              enableW3CTraceContext: props.lambdaEnableW3CTraceContext === true,
              applyAutoTraceTag,
              lumigoTag: props.lumigoTag,
            });
            if (props.lumigoTag) {
              applyAwsTagThroughTagManager(LUMIGO_TAG_TAG_NAME, props.lumigoTag!);
            }
            if (props.applyAutoTraceTag) {
              applyAwsTagThroughTagManager(LUMIGO_AUTOTRACE_TAG_NAME, LUMIGO_AUTOTRACE_TAG_VALUE);
            }
          } catch (e) {
            if (e instanceof UnsupportedLambdaRuntimeError) {
              lumigo.info(construct, `The '${e.unsupportedRuntime}' cannot be automatically traced by Lumigo.`);
            } else {
              throw e;
            }
          }
        } else if (props.traceEcs !== false) {
          if (isSupportedEcsServiceConstruct(construct)) {
            lumigo.traceEcsService(construct, {
              applyAutoTraceTag,
              lumigoAutoTraceImage: props.lumigoAutoTraceImage,
            });
            if (props.lumigoTag) {
              applyAwsTagThroughTagManager(LUMIGO_TAG_TAG_NAME, props.lumigoTag!);
            }
            if (props.applyAutoTraceTag) {
              applyAwsTagThroughTagManager(LUMIGO_AUTOTRACE_TAG_NAME, LUMIGO_AUTOTRACE_TAG_VALUE);
            }
          } else if (isSupportedEcsScheduledTaskConstruct(construct)) {
            lumigo.traceEcsScheduledTask(construct, {
              applyAutoTraceTag,
              lumigoAutoTraceImage: props.lumigoAutoTraceImage,
            });
            if (props.lumigoTag) {
              applyAwsTagThroughTagManager(LUMIGO_TAG_TAG_NAME, props.lumigoTag!);
            }
            if (props.applyAutoTraceTag) {
              applyAwsTagThroughTagManager(LUMIGO_AUTOTRACE_TAG_NAME, LUMIGO_AUTOTRACE_TAG_VALUE);
            }
          } else if (isSupportedEcsTaskDefinitionConstruct(construct)) {
            lumigo.traceEcsTaskDefinition(construct, {
              applyAutoTraceTag,
              lumigoAutoTraceImage: props.lumigoAutoTraceImage,
            });
            if (props.lumigoTag) {
              applyAwsTagThroughTagManager(LUMIGO_TAG_TAG_NAME, props.lumigoTag!);
            }
            if (props.applyAutoTraceTag) {
              applyAwsTagThroughTagManager(LUMIGO_AUTOTRACE_TAG_NAME, LUMIGO_AUTOTRACE_TAG_VALUE);
            }
          }
        }
      },
    };
  }

  /**
   * This method returns a wrapper that can be used in conjunction with the {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs.TaskDefinition.html#addwbrextensionextension|TaskDefinition.addExtension} method.
   * The effect is the same as using the {@link Lumigo#traceEcsTaskDefinition} method on the `TaskDefinition` on which you would invoke `TaskDefinition.addExtension`.
   *
   * @returns A wrapper that invokes {@link Lumigo#traceEcsTaskDefinition} on the task definition to be extended.
   */
  public asEcsExtension(): ITaskDefinitionExtension {
    return {
      extend: this.traceEcsTaskDefinition.bind(this),
    };
  }

  /**
   * Apply Lumigo autotracing for Java, Node.js and Python applications deployed through the provided ECS ScheduledTask construct.
   */
  public traceEcsScheduledTask(scheduledTask: SupportedEcsScheduledTask, props: TraceEcsScheduledTaskProps = {
    applyAutoTraceTag: true,
  }) {
    // For the people not using TypeScript, we need to perform some basic type validation
    assertExpectedConstructType('traceEcsScheduledTask', 'ScheduledEc2Task or ScheduledFargateTask', scheduledTask, (c) => isSupportedEcsScheduledTaskConstruct(c));

    this.doTraceEcsTaskDefinition(scheduledTask.taskDefinition, {
      applyAutoTraceTag: false,
      lumigoAutoTraceImage: props.lumigoAutoTraceImage,
    });

    if (!!props.applyAutoTraceTag) {
      this.applyAutotraceTag(scheduledTask);
    }

    if (!!props.lumigoTag) {
      this.applyLumigoTag(scheduledTask, props.lumigoTag!);
    }
  }

  /**
   * Apply Lumigo autotracing for Java, Node.js and Python applications deployed through the provided ECS Service construct.
   */
  public traceEcsService(service: SupportedEcsService, props: TraceEcsServiceProps = {
    applyAutoTraceTag: true,
  }) {
    // For the people not using TypeScript, we need to perform some basic type validation
    assertExpectedConstructType('traceEcsService', 'EcsService', service, (c) => isSupportedEcsServiceConstruct(c));

    this.doTraceEcsTaskDefinition(service.taskDefinition, {
      applyAutoTraceTag: false,
      lumigoAutoTraceImage: props.lumigoAutoTraceImage,
    });

    if (!!props.applyAutoTraceTag) {
      this.applyAutotraceTag(service);
    }

    if (!!props.lumigoTag) {
      this.applyLumigoTag(service, props.lumigoTag!);
    }
  }

  /**
   * Apply Lumigo autotracing for Java, Node.js and Python applications deployed through the provided `TaskDefinition`.
   * If the ECS workload does not contain Java, Node.js or Python applications, no distributed-tracing data will be reported to Lumigo.
   */
  public traceEcsTaskDefinition(
    taskDefinition: SupportedEcsTaskDefinition,
    props: TraceEcsTaskDefinitionProps = DEFAULT_TRACE_ECS_TASK_DEFINITION_PROPS,
  ) {
    // For the people not using TypeScript, we need to perform some basic type validation
    assertExpectedConstructType('traceEcsTaskDefinition', 'TaskDefinition', taskDefinition, (c) => isSupportedEcsTaskDefinitionConstruct(c));

    this.doTraceEcsTaskDefinition(taskDefinition, props);
  }

  private lumigoTokenAsEcsSecret(scope: Construct): Secret | undefined {
    if (!this.ecsSecrets.has(scope)) {
      const ref = (this.props.lumigoToken as any).rawValue;

      if (ref.value.match(/{{resolve:\S+}}/)) {
        const tokens = ref.value.substring('{{resolve:'.length, ref.value.length - 2).split(':');

        switch (tokens[0]) {
          case CfnDynamicReferenceService.SECRETS_MANAGER: {
            // Secret Manager: '{{resolve:secretsmanager:<secretName>:SecretString:<fieldName>::}}'
            const secretName = tokens[1];
            const fieldName = (tokens.length > 3) ? tokens[3] : undefined;
            this.ecsSecrets.set(scope, Secret.fromSecretsManager(SecretManagerSecret.fromSecretNameV2(scope, 'lumigoTokenSMS', secretName), fieldName));
            break;
          }
          case CfnDynamicReferenceService.SSM_SECURE: {
            // SSM-secure: '{{resolve:ssm-secure:<parameterName>:<version>}}'
            const parameterName = tokens[1];
            const parameterVersion = (tokens.length > 2) ? Number(tokens[2]) : undefined;
            this.ecsSecrets.set(scope, Secret.fromSsmParameter(StringParameter.fromSecureStringParameterAttributes(scope, 'lumigoTokenSSM', {
              parameterName,
              version: parameterVersion,
            })));
            break;
          }
        }
      }
    }

    return this.ecsSecrets.get(scope);
  }

  private doTraceEcsTaskDefinition(taskDefinition: TaskDefinition, props: TraceEcsTaskDefinitionProps = DEFAULT_TRACE_ECS_TASK_DEFINITION_PROPS) {
    /*
     * This function must be idempotent, as `Lumigo.traceEverything()` will apply to
     * both the ECS Service and its ECS TaskDefinition.
     */
    if (!getTaskDefinitionVolumes(taskDefinition).find(volume => volume.name === LUMIGO_INJECTOR_VOLUME_NAME)) {
      taskDefinition.addVolume({
        name: LUMIGO_INJECTOR_VOLUME_NAME,
      });
    }

    // Add injector container
    const TARGET_DIRECTORY_PATH = '/target';
    const injectorContainer = getTaskDefinitionContainers(taskDefinition)
      .find(container => container.containerName === LUMIGO_INJECTOR_CONTAINER_NAME)
      || // We did not find the injector container yet, time to add it
      taskDefinition.addContainer(LUMIGO_INJECTOR_CONTAINER_NAME, {
        image: ContainerImage.fromRegistry(props.lumigoAutoTraceImage || DEFAULT_LUMIGO_INJECTOR_IMAGE_NAME),
        containerName: LUMIGO_INJECTOR_CONTAINER_NAME,
        environment: {
          TARGET_DIRECTORY: TARGET_DIRECTORY_PATH,
        },
        essential: false,
      });

    if (!injectorContainer.mountPoints?.find(mountPoint => mountPoint.sourceVolume === LUMIGO_INJECTOR_VOLUME_NAME)) {
      injectorContainer.addMountPoints({
        sourceVolume: LUMIGO_INJECTOR_VOLUME_NAME,
        containerPath: TARGET_DIRECTORY_PATH,
        readOnly: false,
      });
    }

    /*
     * See if we can construct an ECS secret from the SecretValue
     */
    let tokenSecret: Secret | undefined;
    if ((this.props.lumigoToken as any).rawValue instanceof CfnDynamicReference) {
      tokenSecret = this.lumigoTokenAsEcsSecret(taskDefinition);
    }

    // We wait to start any other container until the inject has done its work
    const otherContainers: ContainerDefinition[] = getTaskDefinitionContainers(taskDefinition)
      .filter((it: ContainerDefinition) => it !== injectorContainer);

    otherContainers.forEach(container => {
      if (!container.containerDependencies?.find(containerDependency => containerDependency.container === injectorContainer)) {
        container.addContainerDependencies({
          container: injectorContainer,
          condition: ContainerDependencyCondition.COMPLETE,
        });
      }

      if (!container.mountPoints?.find(mountPoint => mountPoint.sourceVolume === LUMIGO_INJECTOR_VOLUME_NAME)) {
        container.addMountPoints({
          sourceVolume: LUMIGO_INJECTOR_VOLUME_NAME,
          containerPath: LUMIGO_INJECTOR_VOLUME_MOUNT_POINT,
          readOnly: true,
        });
      }

      // Trigger the injector
      // The environment is implemented as a dictionary, no need for idempotency checks
      container.addEnvironment(LUMIGO_INJECTOR_ENV_VAR_NAME, LUMIGO_INJECTOR_ENV_VAR_VALUE);
      if (tokenSecret) {
        /*
         * The implementation of ContainerDefinition.addSecret does not check for the secret being specified multiple times,
         * so we need to avoid duplication ourselves.
         */
        const secrets: CfnTaskDefinition.SecretProperty[] = (container as any).secrets as CfnTaskDefinition.SecretProperty[];

        if (!secrets.find((entry) => entry.name === LUMIGO_TRACER_TOKEN_ENV_VAR_NAME)) {
          container.addSecret(LUMIGO_TRACER_TOKEN_ENV_VAR_NAME, tokenSecret);
        }
      } else {
        // Could not figure out which type of secret value it is, we go for the unwrap
        container.addEnvironment(LUMIGO_TRACER_TOKEN_ENV_VAR_NAME, this.props.lumigoToken.unsafeUnwrap());
      }
    });

    taskDefinition.node.addValidation(new EcsTaskDefinitionLumigoInjectorVolumeValidation(taskDefinition));
    taskDefinition.node.addValidation(new EcsTaskDefinitionLumigoInjectorContainerValidation(taskDefinition));

    otherContainers.forEach(container => {
      taskDefinition.node.addValidation(new EcsContainerDefinitionLumigoInjectorVolumeMountPointValidation(container));
      taskDefinition.node.addValidation(new EcsContainerDefinitionLumigoInjectorContainerConditionValidation(container, injectorContainer));
      taskDefinition.node.addValidation(new EcsContainerDefinitionHasLumigoInjectorEnvVarValidation(container));
      if (tokenSecret) {
        taskDefinition.node.addValidation(new EcsContainerDefinitionHasLumigoTracerTokenSecretValidation(container));
      } else {
        taskDefinition.node.addValidation(new EcsContainerDefinitionHasLumigoTracerTokenEnvVarValidation(
          container, this.props.lumigoToken.unsafeUnwrap(),
        ));
      }
    });

    if (!!props.applyAutoTraceTag) {
      this.applyAutotraceTag(taskDefinition);
    }

    if (!!props.lumigoTag) {
      this.applyLumigoTag(taskDefinition, props.lumigoTag!);
    }
  }

  /**
   * Apply Lumigo autotracing for the provided Lambda function if it uses a supported Node.js or Python runtime.
   * If the runtime used by the provided function is not supported by [Lumigo Lambda Auto-Tracing](https://docs.lumigo.io/docs/auto-instrumentation),
   * a warning will be added to the CloudFormation template.
   */
  public traceLambda(lambda: SupportedLambdaFunction, props: TraceLambdaProps = {
    enableW3CTraceContext: false,
    applyAutoTraceTag: true,
  }) {
    // For the people not using TypeScript, we need to perform some basic type validation
    assertExpectedConstructType('traceLambda', 'Function', lambda, (c) => c instanceof Function);

    const layerType = this.getLayerType(lambda);
    if (!layerType) {
      this.warning(lambda, 'The runtime used by this function cannot be auto-traced by Lumigo.');
      return;
    }

    const region = Stack.of(lambda).region;

    const layerArn = !!props.layerVersion ? `arn:aws:lambda:${region}:114300393969:layer:${layerType}:${props.layerVersion}` : this.getLayerLatestArn(region, layerType);

    lambda.addLayers(LayerVersion.fromLayerVersionArn(lambda, 'LumigoLayer', layerArn));
    lambda.addEnvironment(LUMIGO_TRACER_TOKEN_ENV_VAR_NAME, this.props.lumigoToken.unsafeUnwrap());

    lambda.node.addValidation(new HasExactlyOneLumigoLayerValidation(lambda));
    lambda.node.addValidation(new HasLumigoTracerEnvVarValidation(lambda));

    if (layerType === LambdaLayerType.NODE) {
      lambda.addEnvironment(AWS_LAMBDA_EXEC_WRAPPER_ENV_VAR_NAME, AWS_LAMBDA_EXEC_WRAPPER_ENV_VAR_VALUE);

      lambda.node.addValidation(new HasAwsLambdaExecWrapperEnvVarValidation(lambda));
    } else if (layerType == LambdaLayerType.PYTHON) {
      /* eslint-disable */
      /*
       * The handler is well hidden in the CfnFunction resource :-(
       */
      const nodeAny = (lambda.node as any);
      const handler = nodeAny?._children['Resource']?.handler;

      if (!!nodeAny && !!nodeAny._children['Resource']) {
        nodeAny._children['Resource'].handler = LUMIGO_LAMBDA_PYTHON_HANDLER;
      }
      /* eslint-enable */

      lambda.addEnvironment(LUMIGO_ORIGINAL_HANDLER_ENV_VAR_NAME, handler);

      lambda.node.addValidation(new HasAwsLambdaOriginalHandlerEnvVarValidation(lambda));
      lambda.node.addValidation(new HasLumigoPythonHandlerInResourceValidation(lambda));
    }

    const enableW3CTraceContext = !!props.enableW3CTraceContext;
    lambda.addEnvironment(LUMIGO_PROPAGATE_W3C_ENV_VAR_NAME, String(enableW3CTraceContext));

    lambda.node.addValidation(new HasLumigoPropagateW3CEnvVarValidation(lambda, enableW3CTraceContext));

    if (!!props.applyAutoTraceTag) {
      this.applyAutotraceTag(lambda);
    }

    if (!!props.lumigoTag) {
      this.applyLumigoTag(lambda, props.lumigoTag!);
    }

    this.info(lambda, `This function has been modified with Lumigo auto-tracing by the '${LUMIGO_AUTOTRACE_TAG_VALUE}' package.`);
  }

  private applyAutotraceTag(construct: Construct): void {
    Tags.of(construct).add(LUMIGO_AUTOTRACE_TAG_NAME, LUMIGO_AUTOTRACE_TAG_VALUE);
  }

  private applyLumigoTag(construct: Construct, value: string): void {
    Tags.of(construct).add(LUMIGO_TAG_TAG_NAME, value);
  }

  private getLayerType(lambda: SupportedLambdaFunction): LambdaLayerType | undefined {
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
        if (!lambda.runtime && lambda instanceof NodejsFunction) {
          /*
           * The NodejsType has the runtime as optional, and then the
           * function will use the default one. The default runtime type
           * is set up conservatively in AWS CDK, with older versions,
           * long supported by Lumigo. So we can rely on the type of
           * the construct to tell us the layer type.
           */
          return LambdaLayerType.NODE;
        }

        /*
         * Check if it is enumeration entries that do not
         * exist in the minimum CDK version we support.
         */
        if (lambda.runtime.name.startsWith('nodejs')) {
          return LambdaLayerType.NODE;
        } else if (lambda.runtime.name.startsWith('python3.')) {
          return LambdaLayerType.PYTHON;
        }
    }

    return undefined;
  }

  private getLayerLatestArn(region: string, type: LambdaLayerType): string {
    const latestLayerArnByRegion = (type === LambdaLayerType.NODE ? lambdaLayersNodejs : lambdaLayersPython);
    const latestLayerArn = (new Map(Object.entries(latestLayerArnByRegion))).get(region);

    if (!latestLayerArn) {
      throw new UnsupportedLambdaLayerRegion(type, region);
    }

    return latestLayerArn;
  }

}

interface TypeTestFn {
  (arg: Construct): boolean;
}

const isSupportedEcsTaskDefinitionConstruct = (construct: Construct): construct is SupportedEcsTaskDefinition => {
  return construct instanceof FargateTaskDefinition || construct instanceof Ec2TaskDefinition;
};

const isSupportedEcsScheduledTaskConstruct = (construct: Construct): construct is SupportedEcsScheduledTask => {
  return construct instanceof ScheduledEc2Task || construct instanceof ScheduledFargateTask;
};

const isSupportedEcsServiceConstruct = (construct: Construct): construct is SupportedEcsPatternsService => {
  return construct instanceof Ec2Service ||
    construct instanceof FargateService ||
    construct instanceof ApplicationLoadBalancedEc2Service ||
    construct instanceof ApplicationLoadBalancedFargateService ||
    construct instanceof ApplicationMultipleTargetGroupsEc2Service ||
    construct instanceof ApplicationMultipleTargetGroupsFargateService ||
    construct instanceof NetworkLoadBalancedEc2Service ||
    construct instanceof NetworkLoadBalancedFargateService ||
    construct instanceof NetworkMultipleTargetGroupsEc2Service ||
    construct instanceof NetworkMultipleTargetGroupsFargateService ||
    construct instanceof QueueProcessingEc2Service ||
    construct instanceof QueueProcessingFargateService;
};

function assertExpectedConstructType(invokedMethod: string, expectedType: string, construct: Construct, test: TypeTestFn) {
  if (!test(construct)) {
    let message = `Lumigo.${invokedMethod} needs a ${expectedType} as input`;

    const additionalHint = getTypeErrorHint(construct);
    if (additionalHint) {
      message = `${message}; ${additionalHint}`;
    }

    throw new Error(message);
  }
}

function getTypeErrorHint(construct: Construct): (string | undefined) {
  if (construct instanceof App) {
    return 'are you maybe looking for Lumigo.traceEverything instead?';
  } else if (construct instanceof Function) {
    return 'are you maybe looking for Lumigo.traceLambda instead?';
  } else if (construct instanceof TaskDefinition) {
    return 'are you maybe looking for Lumigo.traceEcsTaskDefinition instead?';
  } else if (isSupportedEcsScheduledTaskConstruct(construct)) {
    return 'are you maybe looking for Lumigo.traceEcsScheduledTask instead?';
  } else if (isSupportedEcsServiceConstruct(construct)) {
    return 'are you maybe looking for Lumigo.traceEcsService instead?';
  }

  return undefined;
}

abstract class TaskDefinitionValidation implements IValidation {

  private readonly taskDefinition: TaskDefinition;

  private readonly issues: string[] = [];

  constructor(taskDefinition: TaskDefinition) {
    this.taskDefinition = taskDefinition;
  }

  protected addIssue = (issue: string) => this.issues.push(issue);

  public validate(): string[] {
    this.validateTaskDefinition(this.taskDefinition);

    return this.issues;
  }

  protected abstract validateTaskDefinition(taskDefinition: TaskDefinition): void;

}

class EcsTaskDefinitionLumigoInjectorContainerValidation extends TaskDefinitionValidation {

  constructor(taskDefinition: TaskDefinition) {
    super(taskDefinition);
  }

  protected validateTaskDefinition(taskDefinition: TaskDefinition): void {
    var lumigoInjectorContainers = getTaskDefinitionContainers(taskDefinition).filter(container => container.containerName == 'lumigo-injector');
    switch (lumigoInjectorContainers.length) {
      case 0: {
        this.addIssue(`No container called '${LUMIGO_INJECTOR_CONTAINER_NAME}' found; did you modify the task definition after adding Lumigo tracing to it?`);
        return;
      }
      case 1: {
        // TODO Validate container image
        break;
      }
      default: {
        this.addIssue(`${lumigoInjectorContainers.length} containers called '${LUMIGO_INJECTOR_CONTAINER_NAME}' found; did you set Lumigo tracing up multiple times for this task definition?`);
        return;
      }
    }
  }

}

class EcsTaskDefinitionLumigoInjectorVolumeValidation extends TaskDefinitionValidation {

  constructor(taskDefinition: TaskDefinition) {
    super(taskDefinition);
  }

  protected validateTaskDefinition(taskDefinition: TaskDefinition): void {
    var lumigoInjectorVolumes = getTaskDefinitionVolumes(taskDefinition)?.filter(volume => volume.name == 'lumigo-injector');

    switch (lumigoInjectorVolumes?.length || 0) {
      case 0: {
        this.addIssue(`No volume called '${LUMIGO_INJECTOR_VOLUME_NAME}' found; did you modify the task definition after adding Lumigo tracing to it?`);
        return;
      }
      case 1: {
        break;
      }
      default: {
        this.addIssue(`${lumigoInjectorVolumes.length} volume called '${LUMIGO_INJECTOR_VOLUME_NAME}' found; did you set Lumigo tracing up multiple times for this task definition?`);
        return;
      }
    }

    const lumigoInjectorVolume = lumigoInjectorVolumes[0];
    if (!!lumigoInjectorVolume.dockerVolumeConfiguration) {
      this.addIssue(`The '${LUMIGO_INJECTOR_VOLUME_NAME}' volume has 'dockerVolumeConfiguration's attached to it; did you modify the task definition after adding Lumigo tracing to it?`);
    }
    if (!!lumigoInjectorVolume.efsVolumeConfiguration) {
      this.addIssue(`The '${LUMIGO_INJECTOR_VOLUME_NAME}' volume has 'efsVolumeConfiguration's attached to it; did you modify the task definition after adding Lumigo tracing to it?`);
    }
  }

}

abstract class ContainerDefinitionValidation implements IValidation {

  private readonly containerDefinition: ContainerDefinition;

  private readonly issues: string[] = [];

  constructor(containerDefinition: ContainerDefinition) {
    this.containerDefinition = containerDefinition;
  }

  protected addIssue = (issue: string) => this.issues.push(`Container '${this.containerDefinition.containerName}': ${issue}`);

  public validate(): string[] {
    this.validateContainerDefinition(this.containerDefinition);

    return this.issues;
  }

  protected abstract validateContainerDefinition(containerDefinition: ContainerDefinition): void;

}

class EcsContainerDefinitionLumigoInjectorVolumeMountPointValidation extends ContainerDefinitionValidation {

  constructor(containerDefinition: ContainerDefinition) {
    super(containerDefinition);
  }

  protected validateContainerDefinition(containerDefinition: ContainerDefinition) {
    const injectorVolumeMountPoint = containerDefinition.mountPoints?.find(mountPoint => mountPoint.sourceVolume === LUMIGO_INJECTOR_VOLUME_NAME);

    if (!injectorVolumeMountPoint) {
      this.addIssue(`No mount point '${LUMIGO_INJECTOR_VOLUME_NAME}' found`);
    } else {
      if (!injectorVolumeMountPoint.readOnly) {
        this.addIssue(`The mount point for the '${LUMIGO_INJECTOR_VOLUME_NAME}' volume is not set to read-only`);
      }
      if (injectorVolumeMountPoint.containerPath !== LUMIGO_INJECTOR_VOLUME_MOUNT_POINT) {
        this.addIssue(`The container path of the mount point for the '${LUMIGO_INJECTOR_VOLUME_NAME}' volume is not set to '${LUMIGO_INJECTOR_VOLUME_MOUNT_POINT}'`);
      }
    }
  }

}

class EcsContainerDefinitionLumigoInjectorContainerConditionValidation extends ContainerDefinitionValidation {

  readonly injectorContainer: ContainerDefinition;

  constructor(containerDefinition: ContainerDefinition, injectorContainer: ContainerDefinition) {
    super(containerDefinition);
    this.injectorContainer = injectorContainer;
  }

  protected validateContainerDefinition(containerDefinition: ContainerDefinition) {
    const lumigoInjectorContainerDependency = containerDefinition.containerDependencies
      .find(containerDependency => containerDependency.container === this.injectorContainer);

    if (lumigoInjectorContainerDependency?.condition !== ContainerDependencyCondition.COMPLETE) {
      this.addIssue(`The container dependency condition of the '${containerDefinition.containerName}' on the '${this.injectorContainer.containerName}' is not set to '${ContainerDependencyCondition.COMPLETE}'`);
    }
  }

}

class EcsContainerDefinitionHasLumigoInjectorEnvVarValidation extends ContainerDefinitionValidation {

  constructor(containerDefinition: ContainerDefinition) {
    super(containerDefinition);
  }

  protected validateContainerDefinition(containerDefinition: ContainerDefinition) {
    const environment: { [key: string]: string } = (containerDefinition as any).environment;

    if (environment[LUMIGO_INJECTOR_ENV_VAR_NAME] !== LUMIGO_INJECTOR_ENV_VAR_VALUE) {
      this.addIssue(`Container '${containerDefinition.containerName}': The '${LUMIGO_INJECTOR_ENV_VAR_NAME}' does not have the expected value '${LUMIGO_INJECTOR_ENV_VAR_VALUE}'`);
    }
  }

}

class EcsContainerDefinitionHasLumigoTracerTokenSecretValidation extends ContainerDefinitionValidation {

  constructor(containerDefinition: ContainerDefinition) {
    super(containerDefinition);
  }

  protected validateContainerDefinition(containerDefinition: ContainerDefinition) {
    const secrets: CfnTaskDefinition.SecretProperty[] = (containerDefinition as any).secrets;

    if (!secrets.find((entry) => entry.name === LUMIGO_TRACER_TOKEN_ENV_VAR_NAME)) {
      // Don't print out the token value, who knows where these logs end up
      this.addIssue(`The '${LUMIGO_TRACER_TOKEN_ENV_VAR_NAME}' does is not mounted as a secret built from the SecretValue passed to the Lumigo object`);
    }
  }

}

class EcsContainerDefinitionHasLumigoTracerTokenEnvVarValidation extends ContainerDefinitionValidation {

  readonly expectedToken: string;

  constructor(containerDefinition: ContainerDefinition, expectedToken: string) {
    super(containerDefinition);
    this.expectedToken = expectedToken;
  }

  protected validateContainerDefinition(containerDefinition: ContainerDefinition) {
    const environment: { [key: string]: string } = (containerDefinition as any).environment;

    if (environment[LUMIGO_TRACER_TOKEN_ENV_VAR_NAME] !== this.expectedToken) {
      // Don't print out the token value, who knows where these logs end up
      this.addIssue(`The '${LUMIGO_TRACER_TOKEN_ENV_VAR_NAME}' does not have the expected value provided in the SecretValue passed to the Lumigo object`);
    }
  }

}

class HasExactlyOneLumigoLayerValidation implements IValidation {

  private readonly lambda: SupportedLambdaFunction;

  constructor(lambda: SupportedLambdaFunction) {
    this.lambda = lambda;
  }

  public validate(): string[] {
    /* eslint-disable */
    const layers: LayerVersion[] = (this.lambda as any)['_layers'];
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

  private readonly lambda: SupportedLambdaFunction;

  constructor(lambda: SupportedLambdaFunction) {
    this.lambda = lambda;
  }

  public validate(): string[] {
    /* eslint-disable */
    const environment = this.lambda['environment'];
    /* eslint-enable */

    if (!environment) {
      return [`No 'environment' property found on this Lambda; consider upgrading your '${name}' package.`];
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

  private readonly lambda: SupportedLambdaFunction;

  constructor(lambda: SupportedLambdaFunction) {
    this.lambda = lambda;
  }

  public validate(): string[] {
    /* eslint-disable */
    const environment = this.lambda['environment'];
    /* eslint-enable */

    if (!environment) {
      return [`No 'environment' property found on this Lambda; consider upgrading your '${name}' package.`];
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

class HasAwsLambdaOriginalHandlerEnvVarValidation implements IValidation {

  private readonly lambda: SupportedLambdaFunction;

  constructor(lambda: SupportedLambdaFunction) {
    this.lambda = lambda;
  }

  public validate(): string[] {
    /* eslint-disable */
    const environment = this.lambda['environment'];
    /* eslint-enable */

    if (!environment) {
      return [`No 'environment' property found on this Lambda; consider upgrading your '${name}' package.`];
    }

    if (!environment[LUMIGO_ORIGINAL_HANDLER_ENV_VAR_NAME]) {
      return [`The '${LUMIGO_ORIGINAL_HANDLER_ENV_VAR_NAME}' environment variable is not set.`];
    }

    const {
      'value': value,
    } = environment[LUMIGO_ORIGINAL_HANDLER_ENV_VAR_NAME];

    if (!value) {
      return [`The '${LUMIGO_ORIGINAL_HANDLER_ENV_VAR_NAME}' environment variable has a blank value.`];
    }

    return [];
  }

}

class HasLumigoPropagateW3CEnvVarValidation implements IValidation {

  private readonly lambda: SupportedLambdaFunction;
  private readonly expectedValue: boolean;

  constructor(lambda: SupportedLambdaFunction, expectedValue: boolean) {
    this.lambda = lambda;
    this.expectedValue = expectedValue;
  }

  public validate(): string[] {
    /* eslint-disable */
    const environment = this.lambda['environment'];
    /* eslint-enable */

    if (!environment) {
      return [`No 'environment' property found on this Lambda; consider upgrading your '${name}' package.`];
    }

    if (!environment[LUMIGO_PROPAGATE_W3C_ENV_VAR_NAME]) {
      return [`The '${LUMIGO_PROPAGATE_W3C_ENV_VAR_NAME}' environment variable is not set.`];
    }

    const {
      'value': value,
    } = environment[LUMIGO_PROPAGATE_W3C_ENV_VAR_NAME];

    if (value !== String(this.expectedValue)) {
      return [`The '${LUMIGO_PROPAGATE_W3C_ENV_VAR_NAME}' environment variable has a different value than the expected '${this.expectedValue}'.`];
    }

    return [];
  }

}

class HasLumigoPythonHandlerInResourceValidation implements IValidation {

  private readonly lambda: SupportedLambdaFunction;

  constructor(lambda: SupportedLambdaFunction) {
    this.lambda = lambda;
  }

  public validate(): string[] {
    /* eslint-disable */
    if ((this.lambda.node as any)._children['Resource'].handler != LUMIGO_LAMBDA_PYTHON_HANDLER) {
      return [`The handler is not set to Lumigo's '${LUMIGO_LAMBDA_PYTHON_HANDLER}'.`];
    }
    /* eslint-enable */

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

function getTaskDefinitionContainers(taskDefinition: TaskDefinition): ContainerDefinition[] {
  return (taskDefinition as any).containers as ContainerDefinition[];
}

function getTaskDefinitionVolumes(taskDefinition: TaskDefinition): Volume[] {
  return (taskDefinition as any).volumes as Volume[] || [];
}
