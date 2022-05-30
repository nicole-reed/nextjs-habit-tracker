// Gets all users
import dbConnect from "../../../lib/dbConnect";
import User from '../../../models/user';
import Habit from '../../../models/habit';
import { Record, String, Optional, Boolean } from 'runtypes';


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
                    return res.status(400).json({ success: false, error: "No users found" });
                }
            } catch (error) {
                console.log(error);
                return res.status(400).send(error);
            }

        default:
            return res.status(400).send("No such API route");
    }
}
