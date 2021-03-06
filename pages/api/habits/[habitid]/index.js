// Gets habit by id
import dbConnect from '../../../../lib/dbConnect';
import Habit from '../../../../models/habit';
import { Record, String } from 'runtypes';
import { NotFoundError } from '../../../../errors/notFound.error';
import handleError from '../../../../utils/handleError';
import { getSession } from 'next-auth/react';

const getHabitByIdRunType = Record({
    query: Record({
        habitid: String
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
                    const validatedRequest = getHabitByIdRunType.check(req)
                    const { habitid } = validatedRequest.query
                    const foundHabit = await Habit.findOne({ _id: habitid }).exec();
                    // Check if any habits found
                    if (foundHabit) {
                        return res.status(200).json({
                            success: true,
                            habit: foundHabit
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

        case "DELETE":
            if (session) {
                try {
                    const validatedRequest = getHabitByIdRunType.check(req)
                    const { habitid } = validatedRequest.query
                    await Habit.deleteOne({ _id: habitid })

                    return res.status(200).json({
                        success: true
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