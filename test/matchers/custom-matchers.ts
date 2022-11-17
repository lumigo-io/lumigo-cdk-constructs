import { expect } from '@jest/globals';
import { Function, LayerVersion } from 'aws-cdk-lib/aws-lambda';
import { IConstruct } from 'constructs';

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveEnvVarWithValue: (name: string, value: string) => CustomMatcherResult;
      toHaveEnvVarSet: (name: string) => CustomMatcherResult;
      toHaveLumigoLayerInRegion: (layer: {
        region: string; name: string;
      }) => CustomMatcherResult;
      toHaveLumigoLayerInRegionWithVersion: (layer: {
        region: string; name: string; version: string;
      }) => CustomMatcherResult;
    }
  }
}

expect.extend({
  toHaveEnvVarWithValue(func, name: string, value: string) {
    if (!(func instanceof Function)) {
      throw new Error('The tested object must be an instance of Function or one of its subclasses');
    }

    /* eslint-disable */
    const v = func['environment'][name];
    const pass = (!!v && v['value'] == value);
    /* eslint-enable */

    if (pass) {
      return {
        message: () =>
          `expected ${func} not to have the environment variable '${name}' set to '${value}'}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${func} to have the environment variable '${name}' set to '${value}'}`,
        pass: false,
      };
    }
  },

  toHaveEnvVarSet(func, name: string) {
    if (!(func instanceof Function)) {
      throw new Error('The tested object must be an instance of Function or one of its subclasses');
    }

    /* eslint-disable */
    const v = func['environment'][name];
    const pass = (!!v && !!v['value']);
    /* eslint-enable */

    if (pass) {
      return {
        message: () =>
          `expected ${func} not to have the environment variable '${name}' set`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${func} to have the environment variable '${name}' set`,
        pass: false,
      };
    }
  },

  toHaveLumigoLayerInRegion(func: IConstruct, layer: {
    region: string;
    name: string;
  }) {
    if (!(func instanceof Function)) {
      throw new Error('The tested object must be an instance of Function or one of its subclasses');
    }

    /* eslint-disable */
    const layers: LayerVersion[]  = (func as any)['_layers'];
    const pass = (!!layers.find(l => l.layerVersionArn.startsWith(`arn:aws:lambda:${layer.region}:114300393969:layer:${layer.name}:`)));
    /* eslint-enable */

    if (pass) {
      return {
        message: () =>
          `expected ${func} not to have the Lumigo layer '${layer.name}' from region '${layer.region}'`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${func} to have the Lumigo layer '${layer.name}' from region '${layer.region}'`,
        pass: false,
      };
    }
  },

  toHaveLumigoLayerInRegionWithVersion(func: IConstruct, layer: {
    region: string;
    name: string;
    version: string;
  }) {
    if (!(func instanceof Function)) {
      throw new Error('The tested object must be an instance of Function or one of its subclasses');
    }

    /* eslint-disable */
    const layers: LayerVersion[]  = (func as any)['_layers'];
    const pass = (!!layers.find(l => l.layerVersionArn.startsWith(`arn:aws:lambda:${layer.region}:114300393969:layer:${layer.name}:${layer.version}`)));
    /* eslint-enable */

    if (pass) {
      return {
        message: () =>
          `expected ${func} not to have the Lumigo layer '${layer.name}' with version '${layer.version}' from region '${layer.region}'`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${func} to have the Lumigo layer '${layer.name}' with version '${layer.version}' from region '${layer.region}'`,
        pass: false,
      };
    }
  },

});
