const { awscdk } = require('projen');
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Michele Mancioppi',
  authorAddress: 'michelem@lumigo.io',
  cdkVersion: '2.24.0',
  defaultReleaseBranch: 'main',
  name: 'lumigo-cdk-constructs',
  repositoryUrl: 'https://github.com/michelem/lumigo-cdk-constructs.git',
  /* Runtime dependencies of this module. */
  deps: [
    '@aws-cdk/aws-lambda-python-alpha@^2.24.0-alpha.0'
  ],                
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();