import mongoose, { model, Schema }  from "mongoose";
const teamSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    members:[{
        type:"String"
    }
    ],
    createdTeamBy: {
  type: Schema.Types.ObjectId,
  ref: "User",
  required: true
}
},
{
    timestamps:true
}
)

export const Team = model("Team",teamSchema)