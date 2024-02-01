// @ts-ignore

// import { mockClient } from 'aws-sdk-client-mock';
// import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

// import { handleGetAllSongs } from '../lambda/get-all-songs';
// import { handleGetSong } from '../lambda/get-song';
// import { handleDeleteSong } from '../lambda/delete-song';
// import { handlePostSong } from '../lambda/post-song';

import { DynamoDB, awsSdkPromiseResponse } from '../__mocks__/aws-sdk';
import { handleGetSong } from '../lambda/get-song';

const db = new DynamoDB.DocumentClient();

describe('Get song method', () => {
    test('return first song in db', async () => {
        const song = {
            id: '1',
            title: 'Since U Been Gone',
            artist: 'Kelly Clarkson'
        };

        awsSdkPromiseResponse.mockReturnValueOnce(Promise.resolve({
            id: '1',
            title: 'Since U Been Gone',
            artist: 'Kelly Clarkson'
        }))

        const returnedSong = await handleGetSong(db, '1');
        expect(db.get).toHaveBeenCalledWith({
            TableName: 'song-items',
            Key: { id: '1' },
        });

        expect(returnedSong).toEqual(song);
    })
})













// const ddbMock = mockClient(DynamoDBDocumentClient);

// const mockDynamoDbScan = jest.fn();

// jest.mock('aws-sdk/clients/dynamodb', () => ({
//     DocumentClient: jest.fn().mockImplementation(() => ({
//         scan: mockDynamoDbScan
//     }))
// }))

// beforeEach(() => {
//     ddbMock.reset();
// });

// describe('CRUD test suite', () => {
//     it("should get user names from the DynamoDB", async () => {
//         ddbMock.on(GetCommand).resolves({
//             Item: {
//                 id: "1",
//                 title: "Since U Been Gone"
//             },
//         });
//         const song = await handleGetSong(ddbMock, "1");
//         expect(song.title).toStrictEqual(["Since U Been Gone"]);
//     });
// })

// describe('CRUD test suite', () => {
//     it('should return all songs from the DynamoDB', async () => {
//         const mockData = {
//             Items: [
//                 { id: '1', title: 'Since U Been Gone', artist: 'Kelly Clarkson', album: 'Breakaway', year: '2004' },
//                 { id: '2', title: 'Because of You', artist: 'Kelly Clarkson', album: 'Breakaway', year: '2004' },
//             ]
//         }
//         ddbMock.on(ScanCommand).resolves(mockData);

//         const response = await handleGetAllSongs(ddbMock);
//         expect(response.statusCode).toEqual(200);
//         expect(response.body).toEqual(JSON.stringify(mockData.Items));
//     })
// })



