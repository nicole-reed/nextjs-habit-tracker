// Gets all of a user's logs
import dbConnect from '../../../../../lib/dbConnect';
import Log from '../../../../../models/Log';

export default async function handler(req, res) {
    const { userid } = req.query
    await dbConnect();
    const { method } = req;
    switch (method) {
        case "GET":
            try {
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
