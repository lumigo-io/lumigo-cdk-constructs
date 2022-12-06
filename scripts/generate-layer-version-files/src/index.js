const AWS = require('aws-sdk');

(async function getLatestLayerArnVersions(layerName) {
  if (!layerName) {
    console.error('No layer name provided!');
    process.exit(1);
  }

  const layers = {};

  const regions = await new AWS.EC2({
    region: 'eu-central-1',
  })
    .describeRegions().promise()
    .then(response => response.Regions || [])
    .catch(() => {
      console.error('Cannot execute EC2.DescribeRegions, falling back on built-in region list.');

      return [
        'af-south-1',
        'ap-east-1',
        'ap-northeast-1',
        'ap-northeast-2',
        'ap-south-1',
        'ap-southeast-1',
        'ap-southeast-2',
        'ca-central-1',
        'eu-central-1',
        'eu-north-1',
        'eu-south-1',
        'eu-west-1',
        'eu-west-2',
        'eu-west-3',
        'me-south-1',
        'sa-east-1',
        'us-east-1',
        'us-east-2',
        'us-west-1',
        'us-west-2',
      ].map(region => ({'RegionName': region}));
    });

  for (var region of regions) {
    const regionName = region.RegionName;
    const lambda = new AWS.Lambda({ region: regionName });
    
    const { LayerVersions } = await lambda.listLayerVersions({
      LayerName: layerName,
    }).promise();
    
    if (!!LayerVersions && Array.isArray(LayerVersions) && !!LayerVersions.length) {
      layers[regionName] = LayerVersions[0].LayerVersionArn;
    }
  }

  console.log(JSON.stringify(layers, Object.keys(layers).sort(), 2));
})(process.argv[2]);