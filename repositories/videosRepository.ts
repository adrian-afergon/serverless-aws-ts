import { DynamoDB } from 'aws-sdk';
import {AttributeMap, AttributeValue, GetItemInput} from "aws-sdk/clients/dynamodb";
import {Video} from "../models/Video";

export class VideosRepository {

    private TABLE_NAME = process.env.DYNAMODB_TABLE ? process.env.DYNAMODB_TABLE: '';

    constructor(private client = new DynamoDB.DocumentClient()) {
    }

    public async get(videoId: AttributeValue): Promise<Video | undefined> {
        const params: GetItemInput = {
            TableName: this.TABLE_NAME,
            Key: {
                id: videoId,
            },
        };

        try {
            const result = await this.client.get(params).promise();
            return result.Item ? mapVideo(result.Item) : undefined;
        } catch (error) {
            throw error;
        }
    }
}

const mapVideo = (item: AttributeMap):Video => ({
   id: item.id as string,
   description: item.description as string,
   title: item.description as string,
   url: item.url as string
});
