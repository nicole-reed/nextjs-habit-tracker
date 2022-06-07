// PUT/GET/PATCH log by id
import dbConnect from '../../../../../../lib/dbConnect';
import Log from '../../../../../../models/log';
import User from '../../../../../../models/user';
import { Record, String } from 'runtypes';
import { NotFoundError } from '../../../../../../errors/notFound.error';
import { BadRequestError } from '../../../../../../errors/badRequest.error';
import handleError from '../../../../../../utils/handleError';
import { getSession } from 'next-auth/react';

const getLogByDateRunType = Record({
    query: Record({
        userid: String,
        date: String
    })
})

const postLogByDateRunType = Record({
    query: Record({
        userid: String,
        date: String
    }),
    body: Record({
        habitID: String,
        habitName: String
    })

})

const updateLogByDateRunType = Record({
    query: Record({
        userid: String,
        date: String
    }),
    body: Record({
        habitID: String,
        habitName: String
    })
})

export default async function handler(req, res) {
    const session = await getSession({ req })
    const habit = req.body
    await dbConnect();
    const { method } = req;
    switch (method) {
        case "POST":
            if (session) {
                try {
                    const validatedRequest = postLogByDateRunType.check(req)
                    const { userid, date } = validatedRequest.query
                    const { habitID, habitName } = validatedRequest.body
                    const user = await User.findOne({ _id: userid })
                    const foundlog = await Log.findOne({ userid: userid, date: date }).exec()

                    if (foundlog) {
                        throw new BadRequestError('Log already exists')
                    }

                    if (user && !foundlog) {
                        // const habitId = habit.habitID
                        // const habitName = habit.habitName
                        const newLog = await new Log({ userid: userid, date: date, habitsCompleted: { [`${habitID}`]: habitName } })

                        await newLog.save()
                        return res.status(200).send(`created log for ${newLog.date}`)
                    } else {
                        throw new NotFoundError('No user found')
                    }
                } catch (error) {
                    handleError(error, res)
                }
            } else {
                console.log('Not logged in')
            }
        case "GET":
            if (session) {
                try {
                    const validatedRequest = getLogByDateRunType.check(req)
                    const { userid, date } = validatedRequest.query

                    const foundlog = await Log.findOne({ userid: userid, date: date }).exec()

                    if (foundlog) {
                        return res.status(200).json({
                            success: true,
                            log: foundlog
                        });
                    }
                    return res.send(`no log for ${date}`)
                } catch (error) {
                    handleError(error, res)
                }
            } else {
                console.log('Not logged in')
            }
        case "PATCH":
            if (session) {
                try {
                    const validatedRequest = updateLogByDateRunType.check(req)
                    const { userid, date } = validatedRequest.query
                    const { habitID, habitName } = validatedRequest.body

                    const foundlog = await Log.findOne({ userid: userid, date: date }).exec()

                    if (foundlog) {
                        if (habit.complete == true) {
                            const updatedLog = await Log.findOneAndUpdate({ _id: foundlog._id }, { [`habitsCompleted.${habitID}`]: habitName })
                            return res.status(200).json({
                                success: true,
                                log: updatedLog
                            })
                        } else {
                            // const updatedLog = await Log.findOneAndUpdate({ _id: foundlog._id }, { [`habitsCompleted.${habitId}`]: habitName })
                            const updatedLog = await Log.findOneAndUpdate({ _id: foundlog._id }, { $unset: { [`habitsCompleted.${habitID}`]: ' ' } })
                            return res.status(200).json({
                                success: true,
                                log: updatedLog
                            })
                        }
                    } else {
                        throw new NotFoundError('No log found')
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
