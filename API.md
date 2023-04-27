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
| <code><a href="#@lumigo/cdk-constructs-v2.LumigoProps.property.lumigoToken">lumigoToken</a></code> | <code>aws-cdk-lib.SecretValue</code> | *No description.* |

---

##### `lumigoToken`<sup>Required</sup> <a name="lumigoToken" id="@lumigo/cdk-constructs-v2.LumigoProps.property.lumigoToken"></a>

```typescript
public readonly lumigoToken: SecretValue;
```

- *Type:* aws-cdk-lib.SecretValue

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
| <code><a href="#@lumigo/cdk-constructs-v2.LumigoTraceProps.property.applyAutoTraceTag">applyAutoTraceTag</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#@lumigo/cdk-constructs-v2.LumigoTraceProps.property.lambdaEnableW3CTraceContext">lambdaEnableW3CTraceContext</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#@lumigo/cdk-constructs-v2.LumigoTraceProps.property.lambdaNodejsLayerVersion">lambdaNodejsLayerVersion</a></code> | <code>number</code> | *No description.* |
| <code><a href="#@lumigo/cdk-constructs-v2.LumigoTraceProps.property.lambdaPythonLayerVersion">lambdaPythonLayerVersion</a></code> | <code>number</code> | *No description.* |
| <code><a href="#@lumigo/cdk-constructs-v2.LumigoTraceProps.property.lumigoAutoTraceImage">lumigoAutoTraceImage</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@lumigo/cdk-constructs-v2.LumigoTraceProps.property.lumigoTag">lumigoTag</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@lumigo/cdk-constructs-v2.LumigoTraceProps.property.traceEcs">traceEcs</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#@lumigo/cdk-constructs-v2.LumigoTraceProps.property.traceLambda">traceLambda</a></code> | <code>boolean</code> | *No description.* |

---

##### `applyAutoTraceTag`<sup>Optional</sup> <a name="applyAutoTraceTag" id="@lumigo/cdk-constructs-v2.LumigoTraceProps.property.applyAutoTraceTag"></a>

```typescript
public readonly applyAutoTraceTag: boolean;
```

- *Type:* boolean

---

##### `lambdaEnableW3CTraceContext`<sup>Optional</sup> <a name="lambdaEnableW3CTraceContext" id="@lumigo/cdk-constructs-v2.LumigoTraceProps.property.lambdaEnableW3CTraceContext"></a>

```typescript
public readonly lambdaEnableW3CTraceContext: boolean;
```

- *Type:* boolean

---

##### `lambdaNodejsLayerVersion`<sup>Optional</sup> <a name="lambdaNodejsLayerVersion" id="@lumigo/cdk-constructs-v2.LumigoTraceProps.property.lambdaNodejsLayerVersion"></a>

```typescript
public readonly lambdaNodejsLayerVersion: number;
```

- *Type:* number

---

##### `lambdaPythonLayerVersion`<sup>Optional</sup> <a name="lambdaPythonLayerVersion" id="@lumigo/cdk-constructs-v2.LumigoTraceProps.property.lambdaPythonLayerVersion"></a>

```typescript
public readonly lambdaPythonLayerVersion: number;
```

- *Type:* number

---

##### `lumigoAutoTraceImage`<sup>Optional</sup> <a name="lumigoAutoTraceImage" id="@lumigo/cdk-constructs-v2.LumigoTraceProps.property.lumigoAutoTraceImage"></a>

```typescript
public readonly lumigoAutoTraceImage: string;
```

- *Type:* string

---

##### `lumigoTag`<sup>Optional</sup> <a name="lumigoTag" id="@lumigo/cdk-constructs-v2.LumigoTraceProps.property.lumigoTag"></a>

```typescript
public readonly lumigoTag: string;
```

- *Type:* string

---

##### `traceEcs`<sup>Optional</sup> <a name="traceEcs" id="@lumigo/cdk-constructs-v2.LumigoTraceProps.property.traceEcs"></a>

```typescript
public readonly traceEcs: boolean;
```

- *Type:* boolean

---

##### `traceLambda`<sup>Optional</sup> <a name="traceLambda" id="@lumigo/cdk-constructs-v2.LumigoTraceProps.property.traceLambda"></a>

```typescript
public readonly traceLambda: boolean;
```

- *Type:* boolean

---

### TraceEcsServiceDefinitionProps <a name="TraceEcsServiceDefinitionProps" id="@lumigo/cdk-constructs-v2.TraceEcsServiceDefinitionProps"></a>

#### Initializer <a name="Initializer" id="@lumigo/cdk-constructs-v2.TraceEcsServiceDefinitionProps.Initializer"></a>

```typescript
import { TraceEcsServiceDefinitionProps } from '@lumigo/cdk-constructs-v2'

const traceEcsServiceDefinitionProps: TraceEcsServiceDefinitionProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@lumigo/cdk-constructs-v2.TraceEcsServiceDefinitionProps.property.applyAutoTraceTag">applyAutoTraceTag</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#@lumigo/cdk-constructs-v2.TraceEcsServiceDefinitionProps.property.lumigoAutoTraceImage">lumigoAutoTraceImage</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@lumigo/cdk-constructs-v2.TraceEcsServiceDefinitionProps.property.lumigoTag">lumigoTag</a></code> | <code>string</code> | *No description.* |

---

##### `applyAutoTraceTag`<sup>Optional</sup> <a name="applyAutoTraceTag" id="@lumigo/cdk-constructs-v2.TraceEcsServiceDefinitionProps.property.applyAutoTraceTag"></a>

```typescript
public readonly applyAutoTraceTag: boolean;
```

- *Type:* boolean

---

##### `lumigoAutoTraceImage`<sup>Optional</sup> <a name="lumigoAutoTraceImage" id="@lumigo/cdk-constructs-v2.TraceEcsServiceDefinitionProps.property.lumigoAutoTraceImage"></a>

```typescript
public readonly lumigoAutoTraceImage: string;
```

- *Type:* string

---

##### `lumigoTag`<sup>Optional</sup> <a name="lumigoTag" id="@lumigo/cdk-constructs-v2.TraceEcsServiceDefinitionProps.property.lumigoTag"></a>

```typescript
public readonly lumigoTag: string;
```

- *Type:* string

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
| <code><a href="#@lumigo/cdk-constructs-v2.TraceEcsTaskDefinitionProps.property.applyAutoTraceTag">applyAutoTraceTag</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#@lumigo/cdk-constructs-v2.TraceEcsTaskDefinitionProps.property.lumigoAutoTraceImage">lumigoAutoTraceImage</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@lumigo/cdk-constructs-v2.TraceEcsTaskDefinitionProps.property.lumigoTag">lumigoTag</a></code> | <code>string</code> | *No description.* |

---

##### `applyAutoTraceTag`<sup>Optional</sup> <a name="applyAutoTraceTag" id="@lumigo/cdk-constructs-v2.TraceEcsTaskDefinitionProps.property.applyAutoTraceTag"></a>

```typescript
public readonly applyAutoTraceTag: boolean;
```

- *Type:* boolean

---

##### `lumigoAutoTraceImage`<sup>Optional</sup> <a name="lumigoAutoTraceImage" id="@lumigo/cdk-constructs-v2.TraceEcsTaskDefinitionProps.property.lumigoAutoTraceImage"></a>

```typescript
public readonly lumigoAutoTraceImage: string;
```

- *Type:* string

---

##### `lumigoTag`<sup>Optional</sup> <a name="lumigoTag" id="@lumigo/cdk-constructs-v2.TraceEcsTaskDefinitionProps.property.lumigoTag"></a>

```typescript
public readonly lumigoTag: string;
```

- *Type:* string

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
| <code><a href="#@lumigo/cdk-constructs-v2.TraceLambdaProps.property.applyAutoTraceTag">applyAutoTraceTag</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#@lumigo/cdk-constructs-v2.TraceLambdaProps.property.enableW3CTraceContext">enableW3CTraceContext</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#@lumigo/cdk-constructs-v2.TraceLambdaProps.property.layerVersion">layerVersion</a></code> | <code>number</code> | *No description.* |
| <code><a href="#@lumigo/cdk-constructs-v2.TraceLambdaProps.property.lumigoTag">lumigoTag</a></code> | <code>string</code> | *No description.* |

---

##### `applyAutoTraceTag`<sup>Optional</sup> <a name="applyAutoTraceTag" id="@lumigo/cdk-constructs-v2.TraceLambdaProps.property.applyAutoTraceTag"></a>

```typescript
public readonly applyAutoTraceTag: boolean;
```

- *Type:* boolean

---

##### `enableW3CTraceContext`<sup>Optional</sup> <a name="enableW3CTraceContext" id="@lumigo/cdk-constructs-v2.TraceLambdaProps.property.enableW3CTraceContext"></a>

```typescript
public readonly enableW3CTraceContext: boolean;
```

- *Type:* boolean

---

##### `layerVersion`<sup>Optional</sup> <a name="layerVersion" id="@lumigo/cdk-constructs-v2.TraceLambdaProps.property.layerVersion"></a>

```typescript
public readonly layerVersion: number;
```

- *Type:* number

---

##### `lumigoTag`<sup>Optional</sup> <a name="lumigoTag" id="@lumigo/cdk-constructs-v2.TraceLambdaProps.property.lumigoTag"></a>

```typescript
public readonly lumigoTag: string;
```

- *Type:* string

---

## Classes <a name="Classes" id="Classes"></a>

### Lumigo <a name="Lumigo" id="@lumigo/cdk-constructs-v2.Lumigo"></a>

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
| <code><a href="#@lumigo/cdk-constructs-v2.Lumigo.asEcsExtension">asEcsExtension</a></code> | *No description.* |
| <code><a href="#@lumigo/cdk-constructs-v2.Lumigo.traceEcsService">traceEcsService</a></code> | *No description.* |
| <code><a href="#@lumigo/cdk-constructs-v2.Lumigo.traceEcsTaskDefinition">traceEcsTaskDefinition</a></code> | *No description.* |
| <code><a href="#@lumigo/cdk-constructs-v2.Lumigo.traceEverything">traceEverything</a></code> | *No description.* |
| <code><a href="#@lumigo/cdk-constructs-v2.Lumigo.traceLambda">traceLambda</a></code> | *No description.* |
| <code><a href="#@lumigo/cdk-constructs-v2.Lumigo.visit">visit</a></code> | *No description.* |

---

##### `asEcsExtension` <a name="asEcsExtension" id="@lumigo/cdk-constructs-v2.Lumigo.asEcsExtension"></a>

```typescript
public asEcsExtension(): ITaskDefinitionExtension
```

##### `traceEcsService` <a name="traceEcsService" id="@lumigo/cdk-constructs-v2.Lumigo.traceEcsService"></a>

```typescript
public traceEcsService(service: Ec2Service | FargateService | QueueProcessingEc2Service | QueueProcessingFargateService | NetworkLoadBalancedEc2Service | NetworkLoadBalancedFargateService | ApplicationLoadBalancedEc2Service | ApplicationLoadBalancedFargateService | ScheduledEc2Task | ScheduledFargateTask | ApplicationMultipleTargetGroupsEc2Service | ApplicationMultipleTargetGroupsFargateService | NetworkMultipleTargetGroupsEc2Service | NetworkMultipleTargetGroupsFargateService, props?: TraceEcsServiceDefinitionProps): void
```

###### `service`<sup>Required</sup> <a name="service" id="@lumigo/cdk-constructs-v2.Lumigo.traceEcsService.parameter.service"></a>

- *Type:* aws-cdk-lib.aws_ecs.Ec2Service | aws-cdk-lib.aws_ecs.FargateService | aws-cdk-lib.aws_ecs_patterns.QueueProcessingEc2Service | aws-cdk-lib.aws_ecs_patterns.QueueProcessingFargateService | aws-cdk-lib.aws_ecs_patterns.NetworkLoadBalancedEc2Service | aws-cdk-lib.aws_ecs_patterns.NetworkLoadBalancedFargateService | aws-cdk-lib.aws_ecs_patterns.ApplicationLoadBalancedEc2Service | aws-cdk-lib.aws_ecs_patterns.ApplicationLoadBalancedFargateService | aws-cdk-lib.aws_ecs_patterns.ScheduledEc2Task | aws-cdk-lib.aws_ecs_patterns.ScheduledFargateTask | aws-cdk-lib.aws_ecs_patterns.ApplicationMultipleTargetGroupsEc2Service | aws-cdk-lib.aws_ecs_patterns.ApplicationMultipleTargetGroupsFargateService | aws-cdk-lib.aws_ecs_patterns.NetworkMultipleTargetGroupsEc2Service | aws-cdk-lib.aws_ecs_patterns.NetworkMultipleTargetGroupsFargateService

---

###### `props`<sup>Optional</sup> <a name="props" id="@lumigo/cdk-constructs-v2.Lumigo.traceEcsService.parameter.props"></a>

- *Type:* <a href="#@lumigo/cdk-constructs-v2.TraceEcsServiceDefinitionProps">TraceEcsServiceDefinitionProps</a>

---

##### `traceEcsTaskDefinition` <a name="traceEcsTaskDefinition" id="@lumigo/cdk-constructs-v2.Lumigo.traceEcsTaskDefinition"></a>

```typescript
public traceEcsTaskDefinition(taskDefinition: TaskDefinition, props?: TraceEcsTaskDefinitionProps): void
```

###### `taskDefinition`<sup>Required</sup> <a name="taskDefinition" id="@lumigo/cdk-constructs-v2.Lumigo.traceEcsTaskDefinition.parameter.taskDefinition"></a>

- *Type:* aws-cdk-lib.aws_ecs.TaskDefinition

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



