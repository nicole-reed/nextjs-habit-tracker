// Gets all of a user's logs
import dbConnect from '../../../../../lib/dbConnect';
import Log from '../../../../../models/log';
import { Record, String, Optional, Boolean } from 'runtypes';

const getLogsByUserIdRunType = Record({
    query: Record({
        userid: String
    })
})

export default async function handler(req, res) {

    await dbConnect();
    const { method } = req;
    switch (method) {
        case "GET":
            try {
                const validatedRequest = getLogsByUserIdRunType.check(req)
                const { userid } = validatedRequest.query
                const foundLogsByUserId = await Log.find({ userid: userid }).exec();
                // Check if any logs found
                if (foundLogsByUserId) {
                    return res.status(200).json({
                        success: true,
                        logs: foundLogsByUserId
                    });
                } else {
                    return res.status(400).json({ success: false, error: "No logs found" });
                }
            } catch (error) {
                console.log(error);
                return res.status(400).send(error);
            }

        default:
            return res.status(400).send("No such API route");
    }
}
