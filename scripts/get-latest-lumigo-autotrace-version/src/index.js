const axios = require('axios');
const AWS = require('aws-sdk');

(async function getLatestLumigoAutoTraceVersion() {
    const ecrpublic = new AWS.ECRPUBLIC({
        region: 'us-east-1',
    });

    const { authorizationData } = await ecrpublic.getAuthorizationToken().promise();
    const { authorizationToken } = authorizationData;

    /*
     * Sample answer:
     *
     * `{"name":"lumigo/lumigo-autotrace","tags":["v10","latest","v12","v9","v7","v1","v4","v6","v8","v3","v11","v5","v2"]}`
     */
    const { tags } = (await axios.get('https://public.ecr.aws/v2/lumigo/lumigo-autotrace/tags/list', {
        headers: {
            Authorization: `Bearer ${authorizationToken}`,
        },
    })).data;

    const tagRegexp = /v(\d+)/;
    const versionTagsNewestToOldest = tags.filter(tag => tag !== 'latest').sort((tag1, tag2) => {
        const version1 = parseInt(tag1.match(tagRegexp)?.[1]);
        const version2 = parseInt(tag2.match(tagRegexp)?.[1]);

        if (version1 < version2) {
            return -1;
        } else if (version1 > version2) {
            return 1;
        } else {
            return 0;
        }
    }).reverse();

    if (!versionTagsNewestToOldest.length) {
        console.error(`No version tags found for the 'lumigo/lumigo-autotrace' list; tags returned from the api: ${tags}`);
        process.exit(1);
    }

    console.log(versionTagsNewestToOldest[0]);
})();