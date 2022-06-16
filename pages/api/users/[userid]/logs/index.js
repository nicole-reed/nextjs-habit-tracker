// Gets all of a user's logs
import dbConnect from '../../../../../lib/dbConnect';
import Log from '../../../../../models/log';
import { Record, String } from 'runtypes';
import { NotFoundError } from '../../../../../errors/notFound.error';
import handleError from '../../../../../utils/handleError';
import { getSession } from 'next-auth/react';

const getLogsByUserIdRunType = Record({
    query: Record({
        userid: String
    })
})

export default async function handler(req, res) {
    const session = await getSession({ req })
    await dbConnect();
    const { method } = req;
    switch (method) {
        case "GET":
            if (session) {
                try {
                    const validatedRequest = getLogsByUserIdRunType.check(req)
                    const { userid } = validatedRequest.query
                    const foundLogsByUserId = await Log.find({ userid: userid }).exec();

                    if (!foundLogsByUserId) {
                        throw new NotFoundError('Log not found')
                    }

                    return res.status(200).json({
                        success: true,
                        logs: foundLogsByUserId
                    });
                } catch (error) {
                    handleError(error, res)
                }
            } else {
                // Not signed in
                console.log('Not signed in')
                res.status(401)
            }

        default:
            return res.status(400).send("No such API route");
    }
}
