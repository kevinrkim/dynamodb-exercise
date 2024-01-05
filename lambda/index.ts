const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event: any, context: any) => {
    let body;
    let statusCode = 200;
    const headers = {
        'Content-Type': 'application/json',
    };
    
    try {
        switch (event.routeKey) {
            case "DELETE /songs/{id}":
                await dynamo.delete({
                    TableName: 'song-items',
                    Key: {
                        id: event.pathParameters.id
                    }
                }).promise();
                body = `Deleted item ${event.pathParameters.id}`;
                break;
            case "GET /songs/{id}":
                body = await dynamo.get({
                    TableName: 'song-items',
                    Key: {
                        id: event.pathParameters.id
                    }
                }).promise();
                break;
            case "PUT /songs/{id}":
                body = await dynamo.put({
                    TableName: 'song-items',
                    Item: JSON.parse(event.body)
                }).promise();
                break;
            case "GET /songs":
                body = await dynamo.scan({ TableName: 'song-items' }).promise();
                break;
            case "POST /songs":
                let requestJSON = JSON.parse(event.body);
                await dynamo.put({
                    TableName: 'song-items',
                    Item: {
                        id: requestJSON.id,
                        title: requestJSON.title,
                        artist: requestJSON.artist,
                        album: requestJSON.album,
                        year: requestJSON.year
                    }
                }).promise();
                body = `Put item ${requestJSON.id}`;
                break;
            default:
                throw new Error(`Unsupported route: "${event.routeKey}"`);
        }
    } catch (err: any) {
        statusCode = 400;
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers
    };
};