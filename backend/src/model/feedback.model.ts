import mongoose, { model, Schema } from 'mongoose'
import { feedback } from '../types/model.interface'

const feedbackSchema = new Schema<feedback>({
    avatar:{
        type:String,
    },
    name:{
        type:String,
        required:true
    },
    company:{type:String,
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

},{
    strict:true,
    timestamps:true
})

feedbackSchema.pre("save", function (next) {
  if (!this.avatar && this.name) {
    this.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      this.name
    )}&background=random&color=fff&size=128&bold=true&rounded=true`
  }
  next()
})


export default model<feedback>('feedback',feedbackSchema)


