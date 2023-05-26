const { awscdk } = require('projen');
const baselineCdkVersion = '2.42.1';
const pythonAlphaVersionSuffix = 'alpha.0';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Lumigo',
  authorEmail: 'support@lumigo.io',
  authorOrganization: true,
  authorUrl: 'https://lumigo.io',
  cdkVersion: baselineCdkVersion,
  defaultReleaseBranch: 'main',
  name: 'lumigo-cdk-constructs',
  description: 'Home to the Lumigo constructs for the AWS Cloud Development Kit (AWS CDK)',
  repositoryUrl: 'https://github.com/lumigo-io/lumigo-cdk-constructs.git',
  bugsUrl: 'https://github.com/lumigo-io/lumigo-cdk-constructs/issues',
  peerDeps: [
    `aws-cdk-lib@^${baselineCdkVersion} < 3`,
    `@aws-cdk/aws-lambda-python-alpha@>= ${baselineCdkVersion}-${pythonAlphaVersionSuffix} < 3`,
  ],
  /* Build dependencies for this module. */
  devDeps: [
    '@jest/globals',
    `aws-cdk-lib@${baselineCdkVersion}`,
    `@aws-cdk/aws-lambda-python-alpha@${baselineCdkVersion}-${pythonAlphaVersionSuffix}`,
  ],
  packageName: '@lumigo/cdk-constructs-v2', /* The "name" in package.json. */
  keywords: [
    'awscdk',
    'cloud-native',
    'infrastructure-as-code',
    'observability',
    'serverless',
    'tracing',
  ],
  majorVersion: 0,
  projenTokenSecret: 'GITHUB_TOKEN',
});
project.package.addField('peerDependenciesMeta', {
  '@aws-cdk/aws-lambda-python-alpha': {
    optional: true,
  },
});
project.synth();
