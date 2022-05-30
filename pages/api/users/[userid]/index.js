// Get single user by id
import dbConnect from "../../../../lib/dbConnect";
import User from '../../../../models/user';
import { Record, String } from 'runtypes';

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
                    return res.status(400).json({ success: false, error: "No users found" });
                }
            } catch (error) {
                console.log(error);
                return res.status(400).send(error);
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
                    return res.status(400).send('user not found')
                }

            } catch (error) {
                console.log(error);
                return res.status(400).send(error);
            }

        default:
            return res.status(400).send("No such API route");
    }
}
