import mongoose, { model, Schema } from "mongoose"

const contestSchema = new Schema({
        title:{
            type: String,
            required: true,
            unique:true
        },
        description:{
            type:String,
            required: true
        },
        brief:{
            type:String,
            required:true,
        },
        image:{
            type:String,
            required:true
        },
        
        deadline:{
            type:Date,
            required:true
        },
        type:{
            type:String,
            enum:["Upcoming","Ongoing","Completed"],
            default:"Upcoming"
        },
        team:[{
            type:Schema.Types.ObjectId,
            ref:"Team"
        }],
        rewards:{
            type: Number,
            required: true
        },
        startingDate:{
             type:Date,
            required:true
        },
    },{
        timestamps:true
    }
)

export const Contest = model("Contest",contestSchema)