exports.getHandler = async (event: any) => {
    try {
        const { id } = event.pathParameters;
        const params = {
            TableName: process.env.TABLE_NAME,
            Key: { id },
        };
        const data = await docClient.get(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify(err),
        };
    }
};