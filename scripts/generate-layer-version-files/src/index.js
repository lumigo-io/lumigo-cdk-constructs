const AWS = require("aws-sdk");

(async function getLatestLayerArnVersions(layerName) {
  if (!layerName) {
    console.error("No layer name provided!");
    process.exit(1);
  }

  const res = {};

  const response = await new AWS.EC2({
    region: 'eu-central-1',
  }).describeRegions().promise();

  for (var region of (response.Regions || [])) {
    const lambda = new AWS.Lambda({ region: region.RegionName });

    const { LayerVersions } = await lambda.listLayerVersions({
      LayerName: layerName,
    }).promise();

    if (!!LayerVersions && Array.isArray(LayerVersions) && !!LayerVersions.length) {
      res[region.RegionName] = LayerVersions[0].LayerVersionArn;
    }
  }

  console.log(JSON.stringify(res, Object.keys(res).sort(), 2));
})(process.argv[2]);