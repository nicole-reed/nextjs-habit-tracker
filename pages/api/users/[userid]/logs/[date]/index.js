// PUT/GET/PATCH/DELETE log by id
import dbConnect from '../../../../../../lib/dbConnect';
import Log from '../../../../../../models/log';
import User from '../../../../../../models/user';

export default async function handler(req, res) {
    const { userid, date } = req.query
    const habit = req.body
    await dbConnect();
    const { method } = req;
    switch (method) {
        case "POST":
            try {
                const user = await User.findOne({ _id: userid })
                const foundlog = await Log.findOne({ userid: userid, date: date }).exec()
                if (foundlog) {
                    return res.status(400).send('log already exists')
                }
                if (user && !foundlog) {
                    const habitId = habit.habitID
                    const habitName = habit.habitName
                    const newLog = await new Log({ userid: userid, date: date, habitsCompleted: { [`${habitId}`]: habitName } })

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
                const foundlog = await Log.findOne({ userid: userid, date: date }).exec()
                const habitId = habit.habitID
                const habitName = habit.habitName

                if (foundlog) {
                    if (habit.complete == true) {
                        const updatedLog = await Log.findOneAndUpdate({ _id: foundlog._id }, { [`habitsCompleted.${habitId}`]: habitName })
                        console.log('updated Log(complete:true)')
                        return res.status(200).json({
                            success: true,
                            log: updatedLog
                        })
                    } else {
                        // const updatedLog = await Log.findOneAndUpdate({ _id: foundlog._id }, { [`habitsCompleted.${habitId}`]: habitName })
                        const updatedLog = await Log.findOneAndUpdate({ _id: foundlog._id }, { $unset: { [`habitsCompleted.${habitId}`]: ' ' } })
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
