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

    const image = req.file?.path;

    // Validation
    if (
      !title ||
      !description ||
      !brief ||
      !deadline ||
      !type ||
      !rewards ||
      !startingDate 
    ) {
      return res.status(400).json({
        msg: "All fields are required",
      });
    }

    // Date validation
    if (new Date(startingDate) > new Date(deadline)) {
      return res.status(400).json({
        msg: "Starting date cannot be after deadline",
      });
    }

    // Duplicate check
    const existingContest = await Contest.findOne({ title });
    if (existingContest) {
      return res.status(400).json({
        msg: "Contest already exists",
      });
    }

    // Safe JSON parse
    let parsedRewards;
    try {
      parsedRewards = JSON.parse(rewards);
    } catch {
      return res.status(400).json({
        msg: "Invalid rewards format",
      });
    }

    // Create contest
    const newContest = await Contest.create({
      title,
      description,
      brief,
      image,
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

export { createContest };