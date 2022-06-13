// Get single user by id
import dbConnect from "../../../../lib/dbConnect";
import User from '../../../../models/user';
import { Record, String } from 'runtypes';
import { NotFoundError } from "../../../../errors/notFound.error";
import handleError from "../../../../utils/handleError";
import { getSession } from 'next-auth/react';

const getUserByIdRunType = Record({
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
                const validatedRequest = getUserByIdRunType.check(req)
                const { userid } = validatedRequest.query

                const foundUser = await User.findOne({ _id: userid });
                // Check if any user found
                if (foundUser) {
                    return res.status(200).json({
                        success: true,
                        User: foundUser
                    });
                } else {
                    throw new NotFoundError('No user found')
                }
            } catch (error) {
                handleError(error, res)
            }
        case "DELETE":
            try {
                const validatedRequest = getUserByIdRunType.check(req)
                const { userid } = validatedRequest.query

                const foundUser = await User.findOne({ _id: userid });

                if (foundUser) {
                    await User.findByIdAndDelete({ _id: userid })

                    console.log('deleted user')
                } else {
                    throw new NotFoundError('No user found')
                }

            } catch (error) {
                handleError(error, res)
            }

        default:
            return res.status(400).send("No such API route");
    }
}
