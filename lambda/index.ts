const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

import { handleGetAllSongs } from './get-all-songs';
import { handleGetSong } from './get-song';
import { handleDeleteSong } from './delete-song';
import { handlePostSong } from './post-song';

exports.handler = async (event: any, context: any) => {
    let body;
    let statusCode = 200;
    const headers = {
        'Content-Type': 'application/json',
    };
    
    try {
        switch (event.routeKey) {
            case "DELETE /songs/{id}":
                body = `Deleted item ${await handleDeleteSong(dynamo, event.pathParameters.id)}`;
                break;
            case "GET /songs/{id}":
                body = await handleGetSong(dynamo, event.pathParameters.id);
                break;
            case "GET /songs":
                body = await handleGetAllSongs(dynamo);
                break;
            case "POST /songs":
                body = `Put item ${await handlePostSong(dynamo, event.body)}`;
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