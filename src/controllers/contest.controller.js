import { Contest } from "../models/contest.model.js";

const createContest = async (req, res) => {
  try {
    const {
      title,
      description,
      brief,
      deadline,
      type,
      rewards,
      startingDate,
    } = req.body;

    // 🔥 parse rewards FIRST
    let parsedRewards;
    try {
      parsedRewards = JSON.parse(rewards);
    } catch {
      return res.status(400).json({
        msg: "Invalid rewards format",
      });
    }

    // ✅ validation AFTER parsing
    if (
      !title ||
      !description ||
      !brief ||
      !deadline ||
      !type ||
      !startingDate ||
      !parsedRewards?.position ||
      !parsedRewards?.amount
    ) {
      return res.status(400).json({
        msg: "All fields are required",
      });
    }

    // ✅ date validation
    if (new Date(startingDate) > new Date(deadline)) {
      return res.status(400).json({
        msg: "Starting date cannot be after deadline",
      });
    }

    // ✅ duplicate check
    const existingContest = await Contest.findOne({ title });
    if (existingContest) {
      return res.status(400).json({
        msg: "Contest already exists",
      });
    }

    // ✅ create WITHOUT image
    const newContest = await Contest.create({
      title,
      description,
      brief,
      deadline,
      type,
      rewards: parsedRewards,
      startingDate,
    });

    return res.status(201).json({
      msg: "Contest created successfully",
      data: newContest,
    });

  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
};

export {createContest}