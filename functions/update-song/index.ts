function updateParams(body: any, id: any) {
    return {
        TableName: process.env.TABLE_NAME,
        Item: {
            id: id,
            title: body.title,
            artist: body.artist,
            album: body.album,
            year: body.year,
        }
    };
}

exports.updateHandler = async (event: any) => {
    try {
        const { id } = event.pathParameters;
        const body = JSON.parse(event.body);
        const params = updateParams(body, id);

        // Create record if it doesn't exist, update if it does
        const data = await docClient.put(params).promise();
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