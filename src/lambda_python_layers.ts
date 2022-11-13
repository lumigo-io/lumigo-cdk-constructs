export type SupportedPythonRegions =
    'us-east-1' |
    'us-east-2' |
    'us-west-1' |
    'us-west-2' |
    'ca-central-1' |
    'eu-north-1' |
    'eu-west-1' |
    'eu-west-2' |
    'eu-west-3' |
    'eu-central-1' |
    'ap-northeast-1' |
    'ap-northeast-2' |
    'ap-southeast-1' |
    'ap-southeast-2' |
    'ap-east-1' |
    'ap-south-1' |
    'sa-east-1' |
    'me-south-1' |
    'af-south-1';

export const LATEST_PYTHON_LAYER_VERSION_BY_REGION: Map<SupportedPythonRegions, Number> = new Map([
    ['us-east-1', 240],
    ['us-east-2', 240],
    ['us-west-1', 240],
    ['us-west-2', 240],
    ['ca-central-1', 240],
    ['eu-north-1', 240],
    ['eu-west-1', 240],
    ['eu-west-2', 240],
    ['eu-west-3', 240],
    ['eu-central-1', 240],
    ['ap-northeast-1', 240],
    ['ap-northeast-2', 240],
    ['ap-southeast-1', 240],
    ['ap-southeast-2', 240],
    ['ap-east-1', 199],
    ['ap-south-1', 240],
    ['sa-east-1', 240],
    ['me-south-1', 199],
    ['af-south-1', 62],
]);
