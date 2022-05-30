// Gets all users
import dbConnect from "../../../lib/dbConnect";
import User from '../../../models/user';
import Habit from '../../../models/habit';
import { Record, String, Optional, Boolean } from 'runtypes';

export default async function handler(req, res) {
    const { habit, id } = req.body;
    await dbConnect();
    const { method } = req;
    switch (method) {
        case "GET":
            try {
                const foundUsers = await User.find();
                // Check if any user found
                if (foundUsers) {
                    return res.status(200).json({
                        success: true,
                        Users: foundUsers
                    });
                } else {
                    return res.status(400).json({ success: false, error: "No users found" });
                }
            } catch (error) {
                console.log(error);
                return res.status(400).send(error);
            }
        // case "PUT":
        //   try {
        //     const user = await User.findById({ _id: id })
        //     if (user) {
        //       const updatedUser = await User.findByIdAndUpdate({ _id: id }, { habits: habit })

        //       await updatedUser.save()
        //       console.log('updated user')
        //     }
        //     return res.status(400).send('user not found')
        //   } catch (error) {
        //     console.log(error);
        //     return res.status(400).send(error);
        //   }
        case "POST":
            try {
                const user = await User.findById({ _id: id })
                if (user) {
                    const newHabit = await new Habit({ userid: id, name: habit })

                    await newHabit.save()
                    console.log('added Habit')
                }
                return res.status(400).send('user not found')
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
