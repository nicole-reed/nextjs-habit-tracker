// Gets all of a user's habits
import dbConnect from '../../../../../lib/dbConnect';
import Habit from '../../../../../models/habit';

export default async function handler(req, res) {
    const { userid } = req.query
    await dbConnect();
    const { method } = req;
    switch (method) {
        case "GET":
            try {

                const foundHabitsByUserId = await Habit.find({ userid: userid }).exec();
                // Check if any habits found
                if (foundHabitsByUserId) {
                    return res.status(200).json({
                        success: true,
                        habits: foundHabitsByUserId
                    });
                } else {
                    return res.status(400).json({ success: false, error: "No habits found" });
                }
            } catch (error) {
                console.log(error);
                return res.status(400).send(error);
            }

        default:
            return res.status(400).send("No such API route");
    }
}