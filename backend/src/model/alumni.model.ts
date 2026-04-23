import mongoose , {Schema , model}  from "mongoose";
import { Alumni, careerStep} from "../types/model.interface";

const CareerStepSchema = new Schema<careerStep>({
  year: { type: String, required: true },
  role: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
}, {_id:false});


const alumniSchema = new Schema<Alumni>({
    name:{type:String, required:true},
    profilePic:{type:String , required:true},
    fileName:{type:String , required:true},
    batch:{type:String , required:true},
    linkedIn:{type:String},
    email:{type:String , unique:true , required:true},
    currentCompany:{type:String , required:true},
    currentRole:{type:String , required:true},
    careerTimeline:{type:[CareerStepSchema] , required:true},
    achievements:{type:[String]},
    quote:{type:String},
},{
  strict: true,      
  timestamps: true   
})

export default model<Alumni>("Alumni", alumniSchema);