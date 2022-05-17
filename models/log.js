import mongoose from "mongoose";

const { Schema } = mongoose;
const logSchema = new Schema({
    date: { type: Date },
    userid: { type: String },
    habitsCompleted: { type: Map, of: String }
});

export default mongoose.models.Log || mongoose.model("Log", logSchema);