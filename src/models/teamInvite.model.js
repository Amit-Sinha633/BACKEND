import mongoose,{Schema,model} from "mongoose";


const teamInviteSchema = new Schema({
  team: {
    type: Schema.Types.ObjectId,
    ref: "Team",
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
}, { timestamps: true });

export const TeamInvite = model("TeamInvite", teamInviteSchema);