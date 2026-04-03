import mongoose, { model, Schema } from "mongoose";

const contestSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    brief: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    deadline: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed"],
      default: "Upcoming",
    },
  },
  {
    timestamps: true,
  },
);

export const Contest = model("Contest", contestSchema);
