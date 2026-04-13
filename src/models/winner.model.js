import mongoose, { model, Schema } from "mongoose";
const winnerSchema = new Schema({
    position:{
        type:Number,
        required:true,
        unique:true
    },
    contestName:{
        type: Schema.Types.ObjectId,
        ref: "Contest",
        required:true
    },
    teamName:{
         type: Schema.Types.ObjectId,
        ref: "Team",
        required:true
    },
    submit:{
        type:Schema.Types.ObjectId,
        ref:"Submit"
    },
    prizeMoney:{
        type: Number
    },
    quality:{
        type:Number,
        required:true
    },
    creativity:{
         type:Number,
        required:true
    },
    completion:{
         type:Number,
        required:true
    },
    usability:{
         type:Number,
        required:true
    }
},{
    timestamps: true
})

export const Winner = model("Winner",winnerSchema)