# API Reference <a name="API Reference" id="api-reference"></a>


## Structs <a name="Structs" id="Structs"></a>

### LumigoAspectProps <a name="LumigoAspectProps" id="@lumigo/cdk-constructs-v2.LumigoAspectProps"></a>

#### Initializer <a name="Initializer" id="@lumigo/cdk-constructs-v2.LumigoAspectProps.Initializer"></a>

```typescript
import { LumigoAspectProps } from '@lumigo/cdk-constructs-v2'

const lumigoAspectProps: LumigoAspectProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@lumigo/cdk-constructs-v2.LumigoAspectProps.property.lambdaEnableW3CTraceContext">lambdaEnableW3CTraceContext</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#@lumigo/cdk-constructs-v2.LumigoAspectProps.property.lambdaNodejsLayerVersion">lambdaNodejsLayerVersion</a></code> | <code>number</code> | *No description.* |
| <code><a href="#@lumigo/cdk-constructs-v2.LumigoAspectProps.property.lambdaPythonLayerVersion">lambdaPythonLayerVersion</a></code> | <code>number</code> | *No description.* |

---

##### `lambdaEnableW3CTraceContext`<sup>Optional</sup> <a name="lambdaEnableW3CTraceContext" id="@lumigo/cdk-constructs-v2.LumigoAspectProps.property.lambdaEnableW3CTraceContext"></a>

```typescript
public readonly lambdaEnableW3CTraceContext: boolean;
```

- *Type:* boolean

---

##### `lambdaNodejsLayerVersion`<sup>Optional</sup> <a name="lambdaNodejsLayerVersion" id="@lumigo/cdk-constructs-v2.LumigoAspectProps.property.lambdaNodejsLayerVersion"></a>

```typescript
public readonly lambdaNodejsLayerVersion: number;
```

- *Type:* number

---

##### `lambdaPythonLayerVersion`<sup>Optional</sup> <a name="lambdaPythonLayerVersion" id="@lumigo/cdk-constructs-v2.LumigoAspectProps.property.lambdaPythonLayerVersion"></a>

```typescript
public readonly lambdaPythonLayerVersion: number;
```

- *Type:* number

---

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

## Classes <a name="Classes" id="Classes"></a>

### Lumigo <a name="Lumigo" id="@lumigo/cdk-constructs-v2.Lumigo"></a>

TODO: Document tracing functions one-by-one TODO: Document using as Aspect to trace all functions.

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
| <code><a href="#@lumigo/cdk-constructs-v2.Lumigo.asAspect">asAspect</a></code> | *No description.* |
| <code><a href="#@lumigo/cdk-constructs-v2.Lumigo.traceEverything">traceEverything</a></code> | *No description.* |
| <code><a href="#@lumigo/cdk-constructs-v2.Lumigo.traceLambda">traceLambda</a></code> | *No description.* |
| <code><a href="#@lumigo/cdk-constructs-v2.Lumigo.visit">visit</a></code> | *No description.* |

---

##### `asAspect` <a name="asAspect" id="@lumigo/cdk-constructs-v2.Lumigo.asAspect"></a>

```typescript
public asAspect(props?: LumigoAspectProps): IAspect
```

###### `props`<sup>Optional</sup> <a name="props" id="@lumigo/cdk-constructs-v2.Lumigo.asAspect.parameter.props"></a>

- *Type:* <a href="#@lumigo/cdk-constructs-v2.LumigoAspectProps">LumigoAspectProps</a>

---

##### `traceEverything` <a name="traceEverything" id="@lumigo/cdk-constructs-v2.Lumigo.traceEverything"></a>

```typescript
public traceEverything(root: App | Stack, props?: LumigoAspectProps): void
```

###### `root`<sup>Required</sup> <a name="root" id="@lumigo/cdk-constructs-v2.Lumigo.traceEverything.parameter.root"></a>

- *Type:* aws-cdk-lib.App | aws-cdk-lib.Stack

---

###### `props`<sup>Optional</sup> <a name="props" id="@lumigo/cdk-constructs-v2.Lumigo.traceEverything.parameter.props"></a>

- *Type:* <a href="#@lumigo/cdk-constructs-v2.LumigoAspectProps">LumigoAspectProps</a>

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



