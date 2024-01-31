/**
 * @param dynamo as dynamodb documentclient object
 * @param songid as id of song to get
 * @returns single song from table based on id param
 */

export const handleGetSong = async(dynamo: any, songid: string) => {
    return await dynamo.get({ 
        TableName: 'song-items',
        Key: { id: songid }
    }).promise();
}