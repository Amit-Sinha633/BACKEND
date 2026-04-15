import mongoose, { Schema } from "mongoose";

const participateSchema = new Schema(
  {
    team: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },

    contest: {
      type: Schema.Types.ObjectId,
      ref: "Contest",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Participate = mongoose.model("Participate", participateSchema);