import { expect } from '@jest/globals';
import { Function } from 'aws-cdk-lib/aws-lambda';

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveEnvVarWithValue: (name: string, value: string) => CustomMatcherResult;
      toHaveEnvVarSet: (name: string) => CustomMatcherResult;
      toHaveLumigoLayerInRegion: (region: string, layerName: string) => CustomMatcherResult;
      toHaveLumigoLayerInRegionWithVersion: (region: string, layerName: string, layerVersion: number) => CustomMatcherResult;
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

  toHaveLumigoLayerInRegion(func, region: string, layerName: string) {
    if (!(func instanceof Function)) {
      throw new Error('The tested object must be an instance of Function or one of its subclasses');
    }

    /* eslint-disable */
    const pass = (!!func._layers.find(layer => layer.layerVersionArn.startsWith(`arn:aws:lambda:${region}:114300393969:layer:${layerName}:`)));
    /* eslint-enable */

    if (pass) {
      return {
        message: () =>
          `expected ${func} not to have the Lumigo layer '${layerName}' from region '${region}'`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${func} to have the Lumigo layer '${layerName}' from region '${region}'`,
        pass: false,
      };
    }
  },

  toHaveLumigoLayerInRegionWithVersion(func, region: string, layerName: string, layerVersion: number) {
    if (!(func instanceof Function)) {
      throw new Error('The tested object must be an instance of Function or one of its subclasses');
    }

    /* eslint-disable */
    const pass = (!!func._layers.find(layer => layer.layerVersionArn.startsWith(`arn:aws:lambda:${region}:114300393969:layer:${layerName}:${layerVersion}`)));
    /* eslint-enable */

    if (pass) {
      return {
        message: () =>
          `expected ${func} not to have the Lumigo layer '${layerName}' with version '${layerVersion}' from region '${region}'`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${func} to have the Lumigo layer '${layerName}' with version '${layerVersion}' from region '${region}'`,
        pass: false,
      };
    }
  },

});
