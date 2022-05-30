// PUT/GET/PATCH/DELETE log by id
import dbConnect from '../../../../../../lib/dbConnect';
import Log from '../../../../../../models/log';
import User from '../../../../../../models/user';
import { Record, String, Optional, Boolean } from 'runtypes';

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
    const habit = req.body
    console.log('habit', habit)
    await dbConnect();
    const { method } = req;
    switch (method) {
        case "POST":
            try {
                const validatedRequest = postLogByDateRunType.check(req)
                const { userid, date } = validatedRequest.query
                const { habitID, habitName } = validatedRequest.body
                const user = await User.findOne({ _id: userid })
                const foundlog = await Log.findOne({ userid: userid, date: date }).exec()

                if (foundlog) {
                    return res.status(400).send('log already exists')
                }

                if (user && !foundlog) {
                    // const habitId = habit.habitID
                    // const habitName = habit.habitName
                    const newLog = await new Log({ userid: userid, date: date, habitsCompleted: { [`${habitID}`]: habitName } })

                    await newLog.save()
                    return res.status(200).send(`created log for ${newLog.date}`)
                } else {
                    return res.status(400).send('user not found')
                }
            } catch (error) {
                console.log(error);
                return res.status(400).send(error);
            }
        case "GET":
            try {
                const validatedRequest = getLogByDateRunType.check(req)
                const { userid, date } = validatedRequest.query

                const foundlog = await Log.findOne({ userid: userid, date: date }).exec()

                if (foundlog) {
                    return res.status(200).json({
                        success: true,
                        log: foundlog
                    })
                } else {
                    return res.status(400).send('log not found')
                }
            } catch (error) {
                console.log(error);
                return res.status(400).send(error);
            }
        case "PATCH":
            try {
                const validatedRequest = updateLogByDateRunType.check(req)
                const { userid, date } = validatedRequest.query
                const { habitID, habitName } = validatedRequest.body

                const foundlog = await Log.findOne({ userid: userid, date: date }).exec()


                if (foundlog) {
                    if (habit.complete == true) {
                        const updatedLog = await Log.findOneAndUpdate({ _id: foundlog._id }, { [`habitsCompleted.${habitID}`]: habitName })
                        console.log('updated Log(complete:true)')
                        return res.status(200).json({
                            success: true,
                            log: updatedLog
                        })
                    } else {
                        // const updatedLog = await Log.findOneAndUpdate({ _id: foundlog._id }, { [`habitsCompleted.${habitId}`]: habitName })
                        const updatedLog = await Log.findOneAndUpdate({ _id: foundlog._id }, { $unset: { [`habitsCompleted.${habitID}`]: ' ' } })
                        console.log('updated Log(complete:false)')
                        return res.status(200).json({
                            success: true,
                            log: updatedLog
                        })
                    }
                } else {
                    return res.status(400).send('not found')
                }
            } catch (error) {
                console.log(error);
                return res.status(400).send(error);
            }
        default:
            return res.status(400).send("No such API route");
    }
}
