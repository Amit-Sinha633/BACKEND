import mongoose, { Schema } from "mongoose";

const participateSchema = new Schema(
    {
        teamName:{
            type:String,
            required:true
        },
        contestName:{
            type:String,
            required:true
        }
    },
    {
        timestamps:true
    }
)

export const Participate = mongoose.model("Participate",participateSchema)