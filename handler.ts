import { VideosRepository } from './videosRepository'
import {Video} from "./models/Video";

export const getVideo = async (event, context, callback) => {

    const videosRepository = new VideosRepository();

    try {
        const video: Video | undefined = await videosRepository.get(event.pathParameters.id);
        callback(null, {
            statusCode: video ? 200 : 404,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(video),
        });
    } catch(error) {
        console.error(error);
        callback(null, {
            statusCode: error.statusCode || 501,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Couldn\'t fetch the todo item.',
        });
    }
};
