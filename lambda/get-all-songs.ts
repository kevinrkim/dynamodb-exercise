/**
 * Scans for all songs in the song-items table
 * @param dynamo dynamodb documentclient object
 * @returns dynamo scan results 
 */

export const handleGetAllSongs = async (dynamo: any) => {
    return await dynamo.scan({
        TableName: 'song-items'
    }).promise();
}
