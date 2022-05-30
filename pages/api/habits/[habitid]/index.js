// Gets habit by id
import dbConnect from '../../../../lib/dbConnect';
import Habit from '../../../../models/habit';
import { Record, String } from 'runtypes';


const getHabitByIdRunType = Record({
    query: Record({
        habitid: String
    })
})

export default async function handler(req, res) {
    await dbConnect();
    const { method } = req;
    switch (method) {
        case "GET":
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
                    return res.status(400).json({ success: false, error: "No habits found" });
                }
            } catch (error) {
                console.log(error);
                return res.status(400).send(error);
            }
        case "DELETE":
            try {
                const validatedRequest = getHabitByIdRunType.check(req)
                const { habitid } = validatedRequest.query
                await Habit.deleteOne({ _id: habitid })

                return res.status(200).json({
                    success: true
                });
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
