import { Schema, model } from "mongoose";
const CareerStepSchema = new Schema({
    year: { type: String, required: true },
    role: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
}, { _id: false });
const alumniSchema = new Schema({
    name: { type: String, required: true },
    profilePic: { type: String, required: true },
    fileName: { type: String, required: true },
    batch: { type: String, required: true },
    linkedIn: { type: String },
    email: { type: String, unique: true, required: true },
    currentCompany: { type: String, required: true },
    currentRole: { type: String, required: true },
    careerTimeline: { type: [CareerStepSchema], required: true },
    achievements: { type: [String] },
    quote: { type: String },
}, {
    strict: true,
    timestamps: true
});
export default model("Alumni", alumniSchema);
