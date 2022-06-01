// Gets all users
import dbConnect from "../../../lib/dbConnect";
import User from '../../../models/user';
import { NotFoundError } from "../../../errors/notFound.error";
import handleError from "../../../utils/handleError";

export default async function handler(req, res) {
    await dbConnect();
    const { method } = req;
    switch (method) {
        case "GET":
            try {
                const foundUsers = await User.find();
                // Check if any user found
                if (foundUsers) {
                    return res.status(200).json({
                        success: true,
                        Users: foundUsers
                    });
                } else {
                    throw new NotFoundError('No users found')
                }
            } catch (error) {
                handleError(error, res)
            }

        default:
            return res.status(400).send("No such API route");
    }
}
