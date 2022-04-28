import mongoose from "mongoose";

const { Schema } = mongoose;
const logSchema = new Schema({

});

export default mongoose.models.Log || mongoose.model("Log", logSchema);