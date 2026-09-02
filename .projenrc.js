const { awscdk, github, DependencyType } = require('projen');
/*
 * The oldest `aws-cdk-lib` we support, and the floor of the peer dependency range.
 */
const minimumCdkVersion = '2.42.1';
/*
 * The version we build and test against. `aws-cdk-lib` 2.253.0 moved the Lambda internals we
 * read for validation into `Box` containers and 2.254.0 did the same to the ECS task
 * definition, so this must stay at or above 2.253.0 to exercise the current layout. The
 * `cdk-compat` workflow covers the two ends of the supported range.
 */
const testedCdkVersion = '2.253.0';
const pythonAlphaVersionSuffix = 'alpha.0';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Lumigo',
  authorEmail: 'support@lumigo.io',
  authorOrganization: true,
  authorUrl: 'https://lumigo.io',
  cdkVersion: testedCdkVersion,
  constructsVersion: '10.5.0',
  /*
   * `aws-cdk-lib` 2.253.0 ships a jsii 5 assembly, which the jsii 1.x compiler cannot read.
   * jsii does not follow semver above 5.0.0, so pin the minor.
   */
  jsiiVersion: '~5.9.0',
  typescriptVersion: '~5.9.0',
  // The floor jsii 5.9 declares
  minNodeVersion: '20.16.0',
  // `minNodeVersion` is the floor we support, not the version CI should pin itself to
  workflowNodeVersion: 'lts/*',
  // `ts-jest` 27 refuses TypeScript 5
  jestOptions: {
    jestVersion: '^29',
  },
  /*
   * projen otherwise pins a dev dependency at the floor of each peer range, which is what we
   * are deliberately moving away from. The build versions are set explicitly below.
   */
  peerDependencyOptions: {
    pinnedDevDependency: false,
  },
  defaultReleaseBranch: 'main',
  name: 'lumigo-cdk-constructs',
  description: 'Home to the Lumigo constructs for the AWS Cloud Development Kit (AWS CDK)',
  repositoryUrl: 'https://github.com/lumigo-io/lumigo-cdk-constructs.git',
  bugsUrl: 'https://github.com/lumigo-io/lumigo-cdk-constructs/issues',
  devDeps: [
    '@jest/globals',
    // The version that works with the jsii 5.9 toolchain
    'jsii-docgen@^10.12.0',
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
  dependabot: true,
  dependabotOptions: {
    // We want precisey these versions as baseline we support
    ignore: [
      {
        dependencyName: 'aws-cdk-lib',
      },
      {
        dependencyName: '@aws-cdk/aws-lambda-python-alpha',
      },
    ],
  },
});
/*
 * `jsii-pacmak` and `jsii-diff` default to a 1.72 line that still bundles jsii-rosetta 1.x.
 * Overriding after construction is the only point where our version wins.
 */
project.addDevDeps('jsii-pacmak@^1.140.0', 'jsii-diff@^1.140.0');

/*
 * `cdkVersion` drives both the version we build against and the peer range, and those must
 * differ here. The build needs a CDK new enough to have the `Box` internals, while consumers
 * only need a CDK that the constructs work with, which is every v2 release. Restate the peer
 * ranges at their floor once projen is done writing them.
 */
for (const [name, range] of Object.entries({
  'aws-cdk-lib': `^${minimumCdkVersion}`,
  '@aws-cdk/aws-lambda-python-alpha': `>= ${minimumCdkVersion}-${pythonAlphaVersionSuffix} < 3`,
  'constructs': '^10.0.5',
})) {
  project.deps.removeDependency(name, DependencyType.PEER);
  project.deps.addDependency(`${name}@${range}`, DependencyType.PEER);
}

/*
 * projen pins the build dependency to the floor of the peer range, so that the tests run
 * against the oldest supported version. We want the opposite by default: the suite runs on a
 * current CDK, and the `cdk-compat` workflow covers the floor.
 */
for (const [name, version] of Object.entries({
  'aws-cdk-lib': testedCdkVersion,
  /*
   * Stays at the floor: an alpha version is a semver prerelease, and a range anchored at
   * `2.42.1-alpha.0` does not match a prerelease of any other version, so jsii rejects the
   * pairing. The package is an optional peer that the constructs only use as a type.
   */
  '@aws-cdk/aws-lambda-python-alpha': `${minimumCdkVersion}-${pythonAlphaVersionSuffix}`,
  // The version `aws-cdk-lib` 2.253.0 requires, while the peer range still allows 10.0.5
  'constructs': '10.5.0',
})) {
  project.deps.removeDependency(name, DependencyType.BUILD);
  project.deps.addDependency(`${name}@${version}`, DependencyType.BUILD);
}

project.package.addField('peerDependenciesMeta', {
  '@aws-cdk/aws-lambda-python-alpha': {
    optional: true,
  },
});

/*
 * The `build` workflow tests one pinned `aws-cdk-lib`. We read private fields of the CDK
 * constructs, which AWS is free to reshape in any release, so this workflow runs the same
 * tests against both ends of the range we claim to support: the floor of the peer dependency
 * and whatever AWS shipped most recently.
 *
 * A failure here means a CDK release needs our attention, not that the branch is bad, so keep
 * this workflow out of the required status checks. It reports the failure rather than
 * swallowing it, because a silent compatibility check tells us nothing.
 */
const cdkCompatWorkflow = project.github.addWorkflow('cdk-compat');
cdkCompatWorkflow.on({
  schedule: [{ cron: '0 6 * * 1' }],
  pullRequest: {},
  workflowDispatch: {},
});

const cdkCompatTargets = {
  floor: `aws-cdk-lib@${minimumCdkVersion} @aws-cdk/aws-lambda-python-alpha@${minimumCdkVersion}-${pythonAlphaVersionSuffix}`,
  latest: 'aws-cdk-lib@latest @aws-cdk/aws-lambda-python-alpha@latest',
};

for (const [name, packages] of Object.entries(cdkCompatTargets)) {
  cdkCompatWorkflow.addJob(name, {
    runsOn: ['ubuntu-latest'],
    permissions: {
      contents: github.workflows.JobPermission.READ,
    },
    env: {
      CI: 'true',
    },
    steps: [
      {
        name: 'Checkout',
        uses: 'actions/checkout@v4',
      },
      {
        name: 'Setup Node.js',
        uses: 'actions/setup-node@v4',
        with: {
          'node-version': 'lts/*',
        },
      },
      {
        name: 'Install dependencies',
        run: 'yarn install --check-files',
      },
      {
        name: `Install the ${name} aws-cdk-lib`,
        run: `yarn add --dev ${packages}`,
      },
      {
        name: 'Report the tested version',
        run: 'node -p "\'aws-cdk-lib \' + require(\'aws-cdk-lib/package.json\').version"',
      },
      {
        name: 'test',
        run: 'npx projen test',
      },
    ],
  });
}

/*
 * jsii warns that the build should use the floor of each peer range. Diverging from that is
 * the point here, so silence the rule rather than let a warning ride on every build.
 */
project.tasks.tryFind('compile').reset(
  'jsii --silence-warnings=reserved-word --silence-warnings=metadata/missing-dev-dependency',
);

project.synth();
