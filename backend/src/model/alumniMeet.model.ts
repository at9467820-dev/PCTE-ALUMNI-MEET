import mongoose, { Schema, model } from "mongoose";
import {
  alumniMeetDocument,
  careerStep,
} from "../types/model.interface";

const AlumniMeetSchema = new Schema<alumniMeetDocument>({
  title: { type: String, required: true },
  time: { type: Date, required: true },
  classJoined: { type: [String]},
  organizedBy: {type: String, required: true},
  location:{type:String , required:true},
  alumni: {type: [mongoose.Schema.Types.ObjectId],ref: "Alumni",required: true,},
  media: {
    images:[
      {
        image:{type:String},
        imageId:{type:String}
      }
    ],
    videoLink: { type: String },
    videoId: { type: String },
  },
  status:{type:String, enum:['Upcoming','Ongoing','Completed'], default:'Upcoming'},
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
},{
  strict: true,      
  timestamps: true   
});

export default model<alumniMeetDocument>("AlumniMeet", AlumniMeetSchema);
