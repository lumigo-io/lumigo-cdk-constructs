export type SupportedNodejsRegions =
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

export const LATEST_NODEJS_LAYER_VERSION_BY_REGION: Map<SupportedNodejsRegions, Number> = new Map([
    ['us-east-1', 215],
    ['us-east-2', 215],
    ['us-west-1', 215],
    ['us-west-2', 218],
    ['ca-central-1', 215],
    ['eu-north-1', 215],
    ['eu-west-1', 215],
    ['eu-west-2', 215],
    ['eu-west-3', 215],
    ['eu-central-1', 215],
    ['ap-northeast-1', 215],
    ['ap-northeast-2', 215],
    ['ap-southeast-1', 215],
    ['ap-southeast-2', 215],
    ['ap-east-1', 200],
    ['ap-south-1', 215],
    ['sa-east-1', 215],
    ['me-south-1', 200],
    ['af-south-1', 92],
]);
