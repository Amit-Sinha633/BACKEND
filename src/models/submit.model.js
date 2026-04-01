import mongoose, { model, Schema } from "mongoose"

const submitSchema = new Schema(
    {
        teamName:{
            type: Schema.Types.ObjectId,
            ref:"Team",
            requird:true
        },
        contest:{
             type: Schema.Types.ObjectId,
            ref:"Contest",
            requird:true
        },
        githubLink:{
            type: String,
            unique: true
        },
        liveLink:{
            type: String,
            unique: true
        },
        
    },
    {
        timestamps: true
    }
)

export const Submit = model("Submit",submitSchema)