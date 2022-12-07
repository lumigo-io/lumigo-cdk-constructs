const { awscdk } = require('projen');
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Lumigo',
  authorEmail: 'support@lumigo.io',
  authorOrganization: true,
  authorUrl: 'https://lumigo.io',
  cdkVersion: '2.27.0',
  defaultReleaseBranch: 'main',
  name: 'lumigo-cdk-constructs',
  description: 'Home to the Lumigo constructs for the AWS Cloud Development Kit (AWS CDK)', /* The description is just a string that helps people understand the purpose of the package. */
  repositoryUrl: 'https://github.com/lumigo-io/lumigo-cdk-constructs.git',
  bugsUrl: 'https://github.com/lumigo-io/lumigo-cdk-constructs/issues',
  /* Runtime dependencies of this module. */
  deps: [
    '@aws-cdk/aws-lambda-python-alpha@^2.27.0-alpha.0',
  ],
  /* Build dependencies for this module. */
  devDeps: [
    '@jest/globals',
  ],
  packageName: '@lumigo/cdk-constructs-v2', /* The "name" in package.json. */
  keywords: ['Observability', 'Serverless', 'Cloud-native', 'Infrastructure-as-code'],
  majorVersion: 0,
});
project.synth();