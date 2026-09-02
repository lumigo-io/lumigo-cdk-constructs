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

/*
 * Since `aws-cdk-lib` 2.253 the Lambda function keeps its environment variables in an `IMapBox`
 * and its layers in an `IArrayBox`, neither of which can be read with a plain index. Older
 * versions use a plain object and a plain array, and we support both.
 */
function getEnvVar(func: Function, name: string): { value?: string } | undefined {
  /* eslint-disable */
  const environment = (func as any)['environment'];
  /* eslint-enable */

  return typeof environment.getEntry === 'function' ? environment.getEntry(name) : environment[name];
}

function getLayers(func: Function): LayerVersion[] {
  /* eslint-disable */
  const layers = (func as any)['_layers'];
  /* eslint-enable */

  return Array.isArray(layers) ? layers : layers.get();
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
    const v = getEnvVar(func, name);
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
    const v = getEnvVar(func, name);
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
    const layers = getLayers(func);
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
    const layers = getLayers(func);
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
