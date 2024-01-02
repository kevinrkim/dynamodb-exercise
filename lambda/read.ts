import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB();

export const handler = async (event: any) => {
    try {
        const params = {
            TableName: 'MusicDB',
            Key: {
                id: event.id
            }
        };

        const result = await dynamodb.getItem(params).promise();

        if (result.Item) {
            return {
                statusCode: 200,
                body: JSON.stringify(result.Item)
            };
        } else {
            return {
                statusCode: 404,
                body: 'Item not found'
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(error)
        };
    }
};
