import cron from "node-cron";
import { Contest } from "../models/contest.model.js";

cron.schedule("* * * * *", async () => {
  console.log("Running cron job...");

  const now = new Date();

  try {
    // Move Upcoming → Ongoing
    const res1 = await Contest.updateMany(
      {
        startingDate: { $lte: now },
        deadline: { $gt: now },
        type: "Upcoming" // ✅ keeping your field
      },
      { $set: { type: "Ongoing" } } // ✅ FIX: use same field
    );

    console.log("Updated to Ongoing:", res1.modifiedCount);

    // Move Ongoing → Completed
    const res2 = await Contest.updateMany(
      {
        deadline: { $lte: now },
        type: { $ne: "Completed" } // ✅ keeping your field
      },
      { $set: { type: "Completed" } } // ✅ FIX
    );

    console.log("Updated to Completed:", res2.modifiedCount);

  } catch (error) {
    console.error(error);
  }
});