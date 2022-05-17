// Gets all habits in db
import dbConnect from "../../../lib/dbConnect";
import Habit from '../../../models/habit';
import User from '../../../models/user'

export default async function handler(req, res) {
    const { habit, userid } = req.body;
    await dbConnect();
    const { method } = req;
    switch (method) {
        case "GET":
            try {
                const foundHabits = await Habit.find({}).exec();
                // Check if any habits found
                if (foundHabits) {
                    return res.status(200).json({
                        success: true,
                        habits: foundHabits
                    });
                } else {
                    return res.status(400).json({ success: false, error: "No habits found" });
                }
            } catch (error) {
                console.log(error);
                return res.status(400).send(error);
            }
        case "POST":
            try {
                const user = await User.findOne({ _id: userid })
                if (user) {
                    const newHabit = await new Habit({ userid: userid, name: habit })

                    await newHabit.save()
                    console.log(`added ${newHabit.name}`)
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



// export default (req, res) => {
//   res.status(200).json({ name: 'John Doe' })
// }
