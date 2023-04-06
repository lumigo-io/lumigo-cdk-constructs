import { dirname, join } from 'path';
import { PythonFunction } from '@aws-cdk/aws-lambda-python-alpha';
import { App, Annotations, IAspect, SecretValue, Stack, Aspects, Tags, TagManager, CfnDynamicReference, CfnDynamicReferenceService } from 'aws-cdk-lib';
import { CfnTaskDefinition, ContainerDefinition, ContainerDependencyCondition, ContainerImage, Ec2Service, FargateService, ITaskDefinitionExtension, Secret, TaskDefinition, Volume } from 'aws-cdk-lib/aws-ecs';
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

type SupportedLambdaFunction = Function | NodejsFunction | PythonFunction;
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
  QueueProcessingFargateService |
  ScheduledEc2Task |
  ScheduledFargateTask
);
type SupportedEcsService = FargateService | Ec2Service | SupportedEcsPatternsService;

export interface LumigoProps {
  readonly lumigoToken: SecretValue;
}

interface CommonTraceProps {
  readonly lumigoTag?: string;
  readonly applyAutoTraceTag?: Boolean;
}

export interface LumigoTraceProps extends CommonTraceProps {
  readonly traceLambda?: boolean;
  readonly traceEcs?: boolean;
  readonly lambdaNodejsLayerVersion?: Number;
  readonly lambdaPythonLayerVersion?: Number;
  readonly lambdaEnableW3CTraceContext?: Boolean;
}

export interface TraceLambdaProps extends CommonTraceProps {
  readonly layerVersion?: Number;
  readonly enableW3CTraceContext?: Boolean;
}

export interface TraceEcsTaskDefinitionProps extends CommonTraceProps {
}

export interface TraceEcsServiceDefinitionProps extends CommonTraceProps {
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

const LUMIGO_INJECTOR_IMAGE_NAME = 'public.ecr.aws/lumigo/lumigo-autotrace:latest';

const LUMIGO_INJECTOR_ENV_VAR_NAME = 'LD_PRELOAD';

const LUMIGO_INJECTOR_ENV_VAR_VALUE = `${LUMIGO_INJECTOR_VOLUME_MOUNT_POINT}/injector/lumigo_injector.so`;

const DEFAULT_LUMIGO_TRACE_PROPS: LumigoTraceProps = {
  traceLambda: true,
  traceEcs: false, // For now it's experimental
  lambdaEnableW3CTraceContext: false,
};

const DEFAULT_TRACE_ECS_TASK_DEFINITION_PROPS: TraceEcsTaskDefinitionProps = {
  applyAutoTraceTag: true,
};

export class Lumigo {

  props: LumigoProps;

  private ecsSecrets: Map<Construct, Secret> = new Map<Construct, Secret>();

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

  public traceEverything(root: App | Stack, props: LumigoTraceProps = DEFAULT_LUMIGO_TRACE_PROPS) {
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
        } else if (!!props.traceEcs) {
          if (
            construct instanceof Ec2Service ||
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
            construct instanceof QueueProcessingFargateService ||
            construct instanceof ScheduledEc2Task ||
            construct instanceof ScheduledFargateTask
          ) {
            lumigo.traceEcsService(construct, {
              applyAutoTraceTag,
            });
            if (props.lumigoTag) {
              applyAwsTagThroughTagManager(LUMIGO_TAG_TAG_NAME, props.lumigoTag!);
            }
            if (props.applyAutoTraceTag) {
              applyAwsTagThroughTagManager(LUMIGO_AUTOTRACE_TAG_NAME, LUMIGO_AUTOTRACE_TAG_VALUE);
            }
          } else if (construct instanceof TaskDefinition) {
            lumigo.traceEcsTaskDefinition(construct, {
              applyAutoTraceTag,
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
   * @returns A wrapper that invokes `traceTaskDefinition` on the task definition to be extended.
   */
  public asEcsExtension(): ITaskDefinitionExtension {
    return {
      extend: this.traceEcsTaskDefinition.bind(this),
    };
  }

  public traceEcsService(service: SupportedEcsService, props: TraceEcsServiceDefinitionProps = {
    applyAutoTraceTag: true,
  }) {
    this.warning(service, 'Autotracing of ECS workloads is experimental; if you find any issues, please let us know at https://support.lumigo.io!');

    this.doTraceEcsTaskDefinition(service.taskDefinition);

    if (!!props.applyAutoTraceTag) {
      this.applyAutotraceTag(service);
    }

    if (!!props.lumigoTag) {
      this.applyLumigoTag(service, props.lumigoTag!);
    }
  }

  public traceEcsTaskDefinition(taskDefinition: TaskDefinition, props: TraceEcsTaskDefinitionProps = DEFAULT_TRACE_ECS_TASK_DEFINITION_PROPS) {
    this.warning(taskDefinition, 'Autotracing of ECS workloads is experimental; if you find any issues, please let us know at https://support.lumigo.io!');
    this.doTraceEcsTaskDefinition(taskDefinition, props);
  }

  private lumigoTokenAsEcsSecret(scope: Construct): Secret | undefined {
    if (!this.ecsSecrets.has(scope)) {
      const ref = (this.props.lumigoToken as any).rawValue;
      const res = (ref as any).value.match(/{{resolve:([^:]+):([^:]+)(?:([^:]*)(?:.*)?)?}}/);
      if (res) {
        const service = res[1];
        const secretName = res[2];
        const other = res[3];
        switch (service) {
          case CfnDynamicReferenceService.SECRETS_MANAGER: {
            const field = other ? other : undefined;
            this.ecsSecrets.set(scope, Secret.fromSecretsManager(SecretManagerSecret.fromSecretNameV2(scope, 'lumigoTokenSMS', secretName), field));
            break;
          }
          case CfnDynamicReferenceService.SSM_SECURE: {
            const parameterVersion = other ? Number(other) : undefined;
            this.ecsSecrets.set(scope, Secret.fromSsmParameter(StringParameter.fromSecureStringParameterAttributes(scope, 'lumigoTokenSSM', {
              parameterName: secretName,
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
        image: ContainerImage.fromRegistry(LUMIGO_INJECTOR_IMAGE_NAME),
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

  public traceLambda(lambda: SupportedLambdaFunction, props: TraceLambdaProps = {
    enableW3CTraceContext: false,
    applyAutoTraceTag: true,
  }) {
    // TODO Add warning old layer
    const layerType = this.getLayerType(lambda);

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

    if (!!props.enableW3CTraceContext) {
      lambda.addEnvironment(LUMIGO_PROPAGATE_W3C_ENV_VAR_NAME, String(true));

      lambda.node.addValidation(new HasLumigoPropagateW3CEnvVarValidation(lambda));
    }

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

  private getLayerType(lambda: SupportedLambdaFunction): LambdaLayerType {
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

  private getLayerLatestArn(region: string, type: LambdaLayerType): string {
    const latestLayerArnByRegion = (type === LambdaLayerType.NODE ? lambdaLayersNodejs : lambdaLayersPython);
    const latestLayerArn = (new Map(Object.entries(latestLayerArnByRegion))).get(region);

    if (!latestLayerArn) {
      throw new UnsupportedLambdaLayerRegion(type, region);
    }

    return latestLayerArn;
  }

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
