// Gets all of a user's habits
import dbConnect from '../../../../../lib/dbConnect';
import Habit from '../../../../../models/habit';
import { Record, String } from 'runtypes';
import { NotFoundError } from '../../../../../errors/notFound.error';
import handleError from '../../../../../utils/handleError';
import { getSession } from 'next-auth/react';

const getHabitsByUserIdRunType = Record({
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
                    const validatedRequest = getHabitsByUserIdRunType.check(req)
                    const { userid } = validatedRequest.query
                    const foundHabitsByUserId = await Habit.find({ userid: userid }).exec();

                    if (foundHabitsByUserId) {
                        return res.status(200).json({
                            success: true,
                            habits: foundHabitsByUserId
                        });
                    } else {
                        throw new NotFoundError('No habits found')
                    }
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
