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

### TraceEcsServiceDefinitionProps <a name="TraceEcsServiceDefinitionProps" id="@lumigo/cdk-constructs-v2.TraceEcsServiceDefinitionProps"></a>

#### Initializer <a name="Initializer" id="@lumigo/cdk-constructs-v2.TraceEcsServiceDefinitionProps.Initializer"></a>

```typescript
import { TraceEcsServiceDefinitionProps } from '@lumigo/cdk-constructs-v2'

const traceEcsServiceDefinitionProps: TraceEcsServiceDefinitionProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@lumigo/cdk-constructs-v2.TraceEcsServiceDefinitionProps.property.applyAutoTraceTag">applyAutoTraceTag</a></code> | <code>boolean</code> | Whether the Lumigo CDK constructs should automatically add the `lumigo:auto-trace` AWS tag with the version of the construct in use. |
| <code><a href="#@lumigo/cdk-constructs-v2.TraceEcsServiceDefinitionProps.property.lumigoAutoTraceImage">lumigoAutoTraceImage</a></code> | <code>string</code> | Which container image to use to instrument ECS workloads. |
| <code><a href="#@lumigo/cdk-constructs-v2.TraceEcsServiceDefinitionProps.property.lumigoTag">lumigoTag</a></code> | <code>string</code> | Which Lumigo tag to apply to your instrumented Lambda functions and ECS workloads. |

---

##### `applyAutoTraceTag`<sup>Optional</sup> <a name="applyAutoTraceTag" id="@lumigo/cdk-constructs-v2.TraceEcsServiceDefinitionProps.property.applyAutoTraceTag"></a>

```typescript
public readonly applyAutoTraceTag: boolean;
```

- *Type:* boolean
- *Default:* true

Whether the Lumigo CDK constructs should automatically add the `lumigo:auto-trace` AWS tag with the version of the construct in use.

---

##### `lumigoAutoTraceImage`<sup>Optional</sup> <a name="lumigoAutoTraceImage" id="@lumigo/cdk-constructs-v2.TraceEcsServiceDefinitionProps.property.lumigoAutoTraceImage"></a>

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

##### `lumigoTag`<sup>Optional</sup> <a name="lumigoTag" id="@lumigo/cdk-constructs-v2.TraceEcsServiceDefinitionProps.property.lumigoTag"></a>

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

##### `traceEcsService` <a name="traceEcsService" id="@lumigo/cdk-constructs-v2.Lumigo.traceEcsService"></a>

```typescript
public traceEcsService(service: Ec2Service | FargateService | QueueProcessingEc2Service | QueueProcessingFargateService | NetworkLoadBalancedEc2Service | NetworkLoadBalancedFargateService | ApplicationLoadBalancedEc2Service | ApplicationLoadBalancedFargateService | ScheduledEc2Task | ScheduledFargateTask | ApplicationMultipleTargetGroupsEc2Service | ApplicationMultipleTargetGroupsFargateService | NetworkMultipleTargetGroupsEc2Service | NetworkMultipleTargetGroupsFargateService, props?: TraceEcsServiceDefinitionProps): void
```

Apply Lumigo autotracing for Java, Node.js and Python applications deployed through the provided ECS Service construct.

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

Apply Lumigo autotracing for Java, Node.js and Python applications deployed through the provided `TaskDefinition`. If the ECS workload does not contain Java, Node.js or Python applications, no distributed-tracing data will be reported to Lumigo.

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



