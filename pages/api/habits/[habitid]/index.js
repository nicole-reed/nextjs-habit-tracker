// Gets habit by id
import dbConnect from '../../../../lib/dbConnect';
import Habit from '../../../../models/habit';

export default async function handler(req, res) {
    const { habitid } = req.query;
    await dbConnect();
    const { method } = req;
    switch (method) {
        case "GET":
            try {
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
