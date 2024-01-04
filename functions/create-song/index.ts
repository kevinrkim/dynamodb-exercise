const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

function getParams(body: any) {
    return {
        TableName: process.env.TABLE_NAME,
        Item: {
            id: crypto.randomUUID(),
            title: body.title,
            artist: body.artist,
            album: body.album,
            year: body.year,
        },
    };
}

exports.createHandler = async (event: any) => {
    try {
        const body = JSON.parse(event.body);
        const params = getParams(body);
        await docClient.put(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({
                title: body.title,
                artist: body.artist,
                album: body.album,
                year: body.year,
            }),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify(err),
        };
    }
};