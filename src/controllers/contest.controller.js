import { Contest } from "../models/contest.model.js";

const createContest = async (req, res) => {
  try {
    const {
      title,
      description,
      brief,
      deadline,
      type,
      startingDate,
      prizes
    } = req.body;
const image = req.file?.path
    if (
      !title ||
      !description ||
      !brief ||
      !deadline ||
      !type ||
      !startingDate ||
      !prizes ||
      !image
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
      startingDate,
      prizes
    });
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

const deleteContest = async(req,res) =>{
  try {
    const {id} = req.params
    const deleteContest = await Contest.findByIdAndDelete(id)
    if(!deleteContest){
      return res.status(400).json({
        msg: "No contest found"
      })
    }
    return res.status(200).json({
      msg: "Contest deleted Successfully"
    })
  } catch (error) {
    return res.status(500).json({
      msg: "Something went wrong from surver"
    })
  }
}

const updateContest = async(req,res) =>{
  try {
    const {id} = req.params
    const newContest = await Contest.findByIdAndUpdate(
      id,
      req.body,
      {returnDocument: "after"}
    )
    if(!newContest){
      return res.status(400).json({
        msg: "No contest found"
      })
    }
    return res.status(200).json({
      msg: "Contest updated successfully",
      data: newContest
    })
  } catch (error) {
    return res.status(500).json({
      msg: "Somethig went wrong from surver"
    })
  }
}
export { createContest,deleteContest,updateContest};