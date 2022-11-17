const { awscdk } = require('projen');
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Michele Mancioppi',
  authorAddress: 'michelem@lumigo.io',
  cdkVersion: '2.27.0',
  defaultReleaseBranch: 'main',
  name: 'lumigo-cdk-constructs',
  description: 'Home to the Lumigo constructs for the AWS Cloud Development Kit (AWS CDK)', /* The description is just a string that helps people understand the purpose of the package. */
  repositoryUrl: 'https://github.com/lumigo-io/lumigo-cdk-constructs.git',
  /* Runtime dependencies of this module. */
  deps: [
    '@aws-cdk/aws-lambda-python-alpha@^2.27.0-alpha.0',
  ],
  /* Build dependencies for this module. */
  devDeps: [
    '@jest/globals',
  ],
  packageName: 'lumigo-cdk2-alpha', /* The "name" in package.json. */
});
project.synth();