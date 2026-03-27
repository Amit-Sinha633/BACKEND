import mongoose, { model, Schema } from "mongoose"

const submitSchema = new Schema(
    {
        teamName:{
            type: String,
            required: true,
            unique: true
        },
        
    },
    {
        timestamps: true
    }
)

export const Submit = model("Submit",submitSchema)