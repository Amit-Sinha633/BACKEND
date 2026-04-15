import mongoose, { model, Schema } from "mongoose"

const submitSchema = new Schema(
    {
        teamName:{
            type: Schema.Types.ObjectId,
            ref:"Team"
        }, 
        contest:{
             type: Schema.Types.ObjectId,
            ref:"Contest",
            required:true
        },
        githubLink:{
            type: String,
        },
        liveLink:{
            type: String,
            required:true
        },
        isSubmited:{
            type:Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

export const Submit = model("Submit",submitSchema)