# API Reference <a name="API Reference" id="api-reference"></a>


## Structs <a name="Structs" id="Structs"></a>

### LumigoAspectProps <a name="LumigoAspectProps" id="lumigo-cdk2-alpha.LumigoAspectProps"></a>

#### Initializer <a name="Initializer" id="lumigo-cdk2-alpha.LumigoAspectProps.Initializer"></a>

```typescript
import { LumigoAspectProps } from 'lumigo-cdk2-alpha'

const lumigoAspectProps: LumigoAspectProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#lumigo-cdk2-alpha.LumigoAspectProps.property.lambdaEnableW3CTraceContext">lambdaEnableW3CTraceContext</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#lumigo-cdk2-alpha.LumigoAspectProps.property.lambdaNodejsLayerVersion">lambdaNodejsLayerVersion</a></code> | <code>number</code> | *No description.* |
| <code><a href="#lumigo-cdk2-alpha.LumigoAspectProps.property.lambdaPythonLayerVersion">lambdaPythonLayerVersion</a></code> | <code>number</code> | *No description.* |

---

##### `lambdaEnableW3CTraceContext`<sup>Optional</sup> <a name="lambdaEnableW3CTraceContext" id="lumigo-cdk2-alpha.LumigoAspectProps.property.lambdaEnableW3CTraceContext"></a>

```typescript
public readonly lambdaEnableW3CTraceContext: boolean;
```

- *Type:* boolean

---

##### `lambdaNodejsLayerVersion`<sup>Optional</sup> <a name="lambdaNodejsLayerVersion" id="lumigo-cdk2-alpha.LumigoAspectProps.property.lambdaNodejsLayerVersion"></a>

```typescript
public readonly lambdaNodejsLayerVersion: number;
```

- *Type:* number

---

##### `lambdaPythonLayerVersion`<sup>Optional</sup> <a name="lambdaPythonLayerVersion" id="lumigo-cdk2-alpha.LumigoAspectProps.property.lambdaPythonLayerVersion"></a>

```typescript
public readonly lambdaPythonLayerVersion: number;
```

- *Type:* number

---

### LumigoProps <a name="LumigoProps" id="lumigo-cdk2-alpha.LumigoProps"></a>

#### Initializer <a name="Initializer" id="lumigo-cdk2-alpha.LumigoProps.Initializer"></a>

```typescript
import { LumigoProps } from 'lumigo-cdk2-alpha'

const lumigoProps: LumigoProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#lumigo-cdk2-alpha.LumigoProps.property.lumigoToken">lumigoToken</a></code> | <code>aws-cdk-lib.SecretValue</code> | *No description.* |

---

##### `lumigoToken`<sup>Required</sup> <a name="lumigoToken" id="lumigo-cdk2-alpha.LumigoProps.property.lumigoToken"></a>

```typescript
public readonly lumigoToken: SecretValue;
```

- *Type:* aws-cdk-lib.SecretValue

---

### TraceLambdaProps <a name="TraceLambdaProps" id="lumigo-cdk2-alpha.TraceLambdaProps"></a>

#### Initializer <a name="Initializer" id="lumigo-cdk2-alpha.TraceLambdaProps.Initializer"></a>

```typescript
import { TraceLambdaProps } from 'lumigo-cdk2-alpha'

const traceLambdaProps: TraceLambdaProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#lumigo-cdk2-alpha.TraceLambdaProps.property.applyAutoTraceTag">applyAutoTraceTag</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#lumigo-cdk2-alpha.TraceLambdaProps.property.enableW3CTraceContext">enableW3CTraceContext</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#lumigo-cdk2-alpha.TraceLambdaProps.property.layerVersion">layerVersion</a></code> | <code>number</code> | *No description.* |

---

##### `applyAutoTraceTag`<sup>Optional</sup> <a name="applyAutoTraceTag" id="lumigo-cdk2-alpha.TraceLambdaProps.property.applyAutoTraceTag"></a>

```typescript
public readonly applyAutoTraceTag: boolean;
```

- *Type:* boolean

---

##### `enableW3CTraceContext`<sup>Optional</sup> <a name="enableW3CTraceContext" id="lumigo-cdk2-alpha.TraceLambdaProps.property.enableW3CTraceContext"></a>

```typescript
public readonly enableW3CTraceContext: boolean;
```

- *Type:* boolean

---

##### `layerVersion`<sup>Optional</sup> <a name="layerVersion" id="lumigo-cdk2-alpha.TraceLambdaProps.property.layerVersion"></a>

```typescript
public readonly layerVersion: number;
```

- *Type:* number

---

## Classes <a name="Classes" id="Classes"></a>

### Lumigo <a name="Lumigo" id="lumigo-cdk2-alpha.Lumigo"></a>

TODO: Document tracing functions one-by-one TODO: Document using as Aspect to trace all functions.

#### Initializers <a name="Initializers" id="lumigo-cdk2-alpha.Lumigo.Initializer"></a>

```typescript
import { Lumigo } from 'lumigo-cdk2-alpha'

new Lumigo(props: LumigoProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#lumigo-cdk2-alpha.Lumigo.Initializer.parameter.props">props</a></code> | <code><a href="#lumigo-cdk2-alpha.LumigoProps">LumigoProps</a></code> | *No description.* |

---

##### `props`<sup>Required</sup> <a name="props" id="lumigo-cdk2-alpha.Lumigo.Initializer.parameter.props"></a>

- *Type:* <a href="#lumigo-cdk2-alpha.LumigoProps">LumigoProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#lumigo-cdk2-alpha.Lumigo.asAspect">asAspect</a></code> | *No description.* |
| <code><a href="#lumigo-cdk2-alpha.Lumigo.traceEverything">traceEverything</a></code> | *No description.* |
| <code><a href="#lumigo-cdk2-alpha.Lumigo.traceLambda">traceLambda</a></code> | *No description.* |
| <code><a href="#lumigo-cdk2-alpha.Lumigo.visit">visit</a></code> | *No description.* |

---

##### `asAspect` <a name="asAspect" id="lumigo-cdk2-alpha.Lumigo.asAspect"></a>

```typescript
public asAspect(props?: LumigoAspectProps): IAspect
```

###### `props`<sup>Optional</sup> <a name="props" id="lumigo-cdk2-alpha.Lumigo.asAspect.parameter.props"></a>

- *Type:* <a href="#lumigo-cdk2-alpha.LumigoAspectProps">LumigoAspectProps</a>

---

##### `traceEverything` <a name="traceEverything" id="lumigo-cdk2-alpha.Lumigo.traceEverything"></a>

```typescript
public traceEverything(root: App | Stack, props?: LumigoAspectProps): void
```

###### `root`<sup>Required</sup> <a name="root" id="lumigo-cdk2-alpha.Lumigo.traceEverything.parameter.root"></a>

- *Type:* aws-cdk-lib.App | aws-cdk-lib.Stack

---

###### `props`<sup>Optional</sup> <a name="props" id="lumigo-cdk2-alpha.Lumigo.traceEverything.parameter.props"></a>

- *Type:* <a href="#lumigo-cdk2-alpha.LumigoAspectProps">LumigoAspectProps</a>

---

##### `traceLambda` <a name="traceLambda" id="lumigo-cdk2-alpha.Lumigo.traceLambda"></a>

```typescript
public traceLambda(lambda: Function | NodejsFunction | PythonFunction, props?: TraceLambdaProps): void
```

###### `lambda`<sup>Required</sup> <a name="lambda" id="lumigo-cdk2-alpha.Lumigo.traceLambda.parameter.lambda"></a>

- *Type:* aws-cdk-lib.aws_lambda.Function | aws-cdk-lib.aws_lambda_nodejs.NodejsFunction | @aws-cdk/aws-lambda-python-alpha.PythonFunction

---

###### `props`<sup>Optional</sup> <a name="props" id="lumigo-cdk2-alpha.Lumigo.traceLambda.parameter.props"></a>

- *Type:* <a href="#lumigo-cdk2-alpha.TraceLambdaProps">TraceLambdaProps</a>

---

##### `visit` <a name="visit" id="lumigo-cdk2-alpha.Lumigo.visit"></a>

```typescript
public visit(construct: IConstruct): void
```

###### `construct`<sup>Required</sup> <a name="construct" id="lumigo-cdk2-alpha.Lumigo.visit.parameter.construct"></a>

- *Type:* constructs.IConstruct

---


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#lumigo-cdk2-alpha.Lumigo.property.props">props</a></code> | <code><a href="#lumigo-cdk2-alpha.LumigoProps">LumigoProps</a></code> | *No description.* |

---

##### `props`<sup>Required</sup> <a name="props" id="lumigo-cdk2-alpha.Lumigo.property.props"></a>

```typescript
public readonly props: LumigoProps;
```

- *Type:* <a href="#lumigo-cdk2-alpha.LumigoProps">LumigoProps</a>

---



