import { Contest } from "../models/contest.model.js";

const createContest = async (req, res) => {
  try {
    const {
      title,
      description,
      brief,
      image,
      deadline,
      type,
      rewards,
      startingDate,
    } = req.body;
console.log(req.body)
    if (
      !title ||
      !description ||
      !brief ||
      !image ||
      !deadline ||
      !type ||
      !rewards ||
      !startingDate
    ) {
      return res.status(400).json({
        msg: "All fields are required",
      });
    }
    const existingContest = await Contest.findOne({ title });

    if (existingContest) {
      return res.status(400).json({
        msg: "Contest already created",
      });
    }
    const newContest = await Contest.create({
      title,
      description,
      brief,
      image,
      deadline,
      type,
      rewards,
      startingDate,
    });
console.log(newContest)
    return res.status(201).json({
      msg: "Contest created successfully",
      data: newContest,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      msg: "Something went wrong while creating the contest",
    });
  }
};

export { createContest };
