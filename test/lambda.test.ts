// @ts-ignore

import { handler } from '../lambda/index.ts';

const mockScan = jest.fn();
const mockGet = jest.fn();

jest.mock('aws-sdk', () => {
    return {
        DynamoDB: {
            DocumentClient: jest.fn(() => ({
                scan: () => mockScan,
                get: () => mockGet,
            })),
        },
    };
});

// unit tests

describe('GET all songs test', () => {
    it('should return a list of all songs in dynamodb', async () => {
        mockScan.mockResolvedValue({ Items: [{ id: '1', name: 'Since U Been Gone', artist: 'Kelly Clarkson', album: 'Breakaway' }, { id: '2', name: 'Because of You', artist: 'Kelly Clarkson', album: 'Breakaway' }] });
        const event = {};
        const response = await handler(event);
        expect(response.statusCode).toBe(200);
        expect(mockScan).toHaveBeenCalled();
    });

    it('should return a single song from dynamodb', async () => {
        mockGet.mockResolvedValue({ Item: { id: '1', name: 'Since U Been Gone', artist: 'Kelly Clarkson', album: 'Breakaway' } });
        const event = {
            pathParameters: {
                id: '1'
            }
        };
        const response = await handler(event);
        expect(response.statusCode).toBe(200);
        expect(mockGet).toHaveBeenCalledWith({ TableName: 'song-items', Key: { id: '1' } });
    });
});
