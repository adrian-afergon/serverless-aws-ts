import {getVideo} from './handler';
import * as AWSMock from "aws-sdk-mock";
import * as AWS from "aws-sdk";
import { GetItemInput } from "aws-sdk/clients/dynamodb";

describe('Video handler', () => {

    beforeEach(() => {
        AWSMock.setSDKInstance(AWS);
    })

    afterEach(() => {
        AWSMock.restore('DynamoDB.DocumentClient')
    })

    it('should get 200', (done) => {
        const expectedId = '1'
        const event = buildEvent(expectedId)
        mockInstanceWithValue({id: expectedId})
        getVideo(event, null, (error, response) => {
            expect(response.statusCode).toBe(200);
            done()
        })
    });

    it('should get 404', (done) => {
        const event = buildEvent('nonexistent id');
        mockInstanceWithValue(null);
        getVideo(event, null, (error, response) => {
            expect(response.statusCode).toBe(404);
            done()
        })
    });

    it('should get 501', (done) => {
        const event = buildEvent();
        mockInstanceWithError('This is an irrelevant error')
        getVideo(event, null, (error, response) => {
            expect(response.statusCode).toBe(501);
            done()
        })
    });

    it('should get custom status', (done) => {
        const event = buildEvent();
        const expectedStatus = 505;
        mockInstanceWithError({statusCode: expectedStatus})
        getVideo(event, null, (error, response) => {
            expect(response.statusCode).toBe(expectedStatus);
            done()
        })
    });

    const buildEvent = (videoId: string = 'irrelevant') => ({
        "pathParameters": {
            "id": videoId
        }
    });

    const mockInstanceWithValue = (response) => {
        AWSMock.mock('DynamoDB.DocumentClient', 'get', (params: GetItemInput, callback: Function) => {
            callback(null, {Item: response});
        })
    }

    const mockInstanceWithError = (error) => {
        AWSMock.mock('DynamoDB.DocumentClient', 'get', (params: GetItemInput, callback: Function) => {
            throw error;
        })
    }

});
