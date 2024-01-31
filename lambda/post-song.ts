/**
 * @param dynamo dynamodb documentclient object
 * @param song as JSON formatted song object to add to songs table
 * @return song that was added to songs table
 */

export const handlePostSong = async(dynamo: any, song: any) => {
    const JSONSong = JSON.parse(song);
    return await dynamo.put({
        TableName: 'song-items',
        Item: {
            id: JSONSong.id,
            title: JSONSong.title,
            artist: JSONSong.artist,
            album: JSONSong.album,
            year: JSONSong.year
        }
    }).promise();
}