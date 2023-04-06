import { expect } from '@jest/globals';
import { Aspects, Tag, TagManager } from 'aws-cdk-lib';
import { Function, LayerVersion } from 'aws-cdk-lib/aws-lambda';
import { Construct, IConstruct } from 'constructs';

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveAwsTag: (key: string, value: string) => CustomMatcherResult;
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
  toHaveAwsTag(construct: Construct, key: string, value: string) {
    const aspects = Aspects.of(construct);
    for (let aspect of aspects.all ) {
      if (aspect instanceof Tag) {
        const tag = aspect as Tag;

        if (tag.key === key) {
          return {
            message: () =>
              `expected ${construct} to have the tag '${key}' set to '${value}'`,
            pass: tag.value === value,
          };
        }
      }
    }

    function checkInTagManager(tagManager: TagManager): jest.CustomMatcherResult | undefined {
      if (!!tagManager) {
        const tagsValues = tagManager.tagValues();
        if (tagsValues) {
          return {
            message: () =>
              `expected ${construct} to have the tag '${key}' set to '${value}'`,
            pass: tagsValues[key] === value,
          };
        }
      }

      return undefined;
    }

    /**
     * Fallback in case we set the tag directly into the tag manager at the
     * construct or scope level.
     */
    const resInConstructTagManager = checkInTagManager((construct as any).tags as TagManager);
    if (resInConstructTagManager) {
      return resInConstructTagManager as jest.CustomMatcherResult;
    }

    const resInConstructScopeTagManager = checkInTagManager((construct as any).node?.scope?.tags as TagManager);
    if (resInConstructScopeTagManager) {
      return resInConstructScopeTagManager as jest.CustomMatcherResult;
    }

    return {
      message: () =>
        `expected ${construct} to have the tag '${key}'`,
      pass: false,
    };
  },

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
