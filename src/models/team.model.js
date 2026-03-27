import mongoose, { model, Schema }  from "mongoose";
const teamSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    members:[{
        type:Schema.Types.ObjectId,
        ref: "User"
    }]
},
{
    timestamps:true
}
)

export const Team = model("Team",teamSchema)