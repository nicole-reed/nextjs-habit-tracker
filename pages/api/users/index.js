// Gets all users
import dbConnect from "../../../lib/dbConnect";
import User from '../../../models/user';
import { NotFoundError } from "../../../errors/notFound.error";
import handleError from "../../../utils/handleError";
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
    const session = await getSession({ req })
    await dbConnect();
    const { method } = req;
    switch (method) {
        case "GET":
            if (session) {
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
            } else {
                console.log('Not signed in')
            }

        default:
            return res.status(400).send("No such API route");
    }
}
