import mongoose from "mongoose";

const { Schema } = mongoose;
const habitSchema = new Schema({
    userid: String,
    name: String,
});

export default mongoose.models.Habit || mongoose.model("Habit", habitSchema);