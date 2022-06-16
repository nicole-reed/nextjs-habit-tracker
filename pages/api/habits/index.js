// Gets all habits in db, creates a new habit
import dbConnect from "../../../lib/dbConnect";
import Habit from '../../../models/habit';
import User from '../../../models/user';
import { Record, String } from 'runtypes';
import { NotFoundError } from '../../../errors/notFound.error';
import { BadRequestError } from "../../../errors/badRequest.error";
import handleError from '../../../utils/handleError';
import { UnauthorizedError } from "../../../errors/unauthorized.error";
import { getSession } from 'next-auth/react';


const createHabitRunType = Record({
    body: Record({
        habit: String,
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
                    const foundHabits = await Habit.find({}).exec();

                    if (foundHabits) {
                        return res.status(200).json({
                            success: true,
                            habits: foundHabits
                        });
                    } else {
                        throw new NotFoundError('No habits found')
                    }
                } catch (error) {
                    handleError(error, res)
                }
            } else {
                // Not Signed in
                res.status(401)
            }

        case "POST":
            if (session) {
                try {
                    const validatedRequest = createHabitRunType.check(req)
                    const { habit, userid } = validatedRequest.body
                    const user = await User.findOne({ _id: userid })

                    if (!user) {
                        throw new NotFoundError('No user found')
                    }

                    const foundHabitsByUserId = await Habit.find({ userid: userid }).exec();
                    let foundHabitsArr = []
                    if (user && foundHabitsByUserId) {
                        foundHabitsByUserId.map(habit => foundHabitsArr.push(habit.name.toLowerCase()))
                    }

                    if (user && foundHabitsArr.includes(habit.toLowerCase())) {
                        throw new BadRequestError('Habit already exists')
                    }

                    if (!habit || habit == " ") {
                        throw new BadRequestError('Habit must contain valid characters')
                    }

                    const newHabit = await new Habit({ userid: userid, name: habit })

                    await newHabit.save()
                    return res.send(`added ${newHabit.name}`)
                } catch (error) {
                    handleError(error, res)
                }
            } else {
                // Not Signed in
                console.log('Not signed in')
                res.status(401)
            }

        default:
            return res.status(400).send("No such API route");
    }
}