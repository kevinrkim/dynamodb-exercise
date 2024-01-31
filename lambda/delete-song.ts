/**
 * 
 * @param dynamo as dynamodb documentclient object
 * @param songid as id of song to delete from songs table
 * @returns deleted song from table based on id param
 */

export const handleDeleteSong = async(dynamo: any, songid: string) => {
    return await dynamo.delete({
        TableName: 'song-items',
        id: songid
    }).promise();
}