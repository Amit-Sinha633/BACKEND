import mongoose, { model, Schema } from "mongoose";

const contestSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
    
    },
    brief: {
      type: String,
   
    },
    image: {
      type: String,
    },
    deadline: {
      type: Date,
    
    },
    type: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed"],
      default: "Upcoming",
    },
    startingDate:{
      type: Date,
   
    },
    prizes:{
      type:String,
  
    }
  },  
  {
    timestamps: true,
  },
);

export const Contest = model("Contest", contestSchema);
