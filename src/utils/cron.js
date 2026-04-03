import cron from "node-cron";
import { Contest } from "../models/contest.model.js";

cron.schedule("* * * * *", async () => {
  console.log("Running cron job...");

  const now = new Date();

  try {
    // Move Upcoming → Ongoing
    await Contest.updateMany(
      {
        startingDate: { $lte: now },
        deadline: { $gt: now },
        type: "Upcoming"
      },
      { $set: { status: "Ongoing" } }
    );

    // Move Ongoing → Completed
    await Contest.updateMany(
      {
        deadline: { $lte: now },
        type: { $ne: "Completed" }
      },
      { $set: { status: "Completed" } }
    );

  } catch (error) {
    console.error(error);
  }
});