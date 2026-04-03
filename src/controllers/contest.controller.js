import { Contest } from "../models/contest.model.js";

const createContest = async (req, res) => {
  try {
    const {
      title,
      description,
      brief,
      image,
      deadline,
      type
    } = req.body;
console.log(req.body)
    if (
      !title ||
      !description ||
      !brief ||
      !deadline ||
      !type 
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
      type
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