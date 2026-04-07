import { Contest } from "../models/contest.model.js";

const createContest = async (req, res) => {
  try {
    const { title, description, brief, deadline, type, startingDate, prizes,participationType } = req.body;
    
    // Check if file exists safely
    const image = req.file?.path; 

    if (!title || !description || !brief || !deadline || !startingDate || !prizes || !image || !participationType) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const existingContest = await Contest.findOne({ title });
    if (existingContest) {
      return res.status(400).json({ msg: "Contest already created" });
    }

    const newContest = await Contest.create({
      title,
      description,
      brief,
      image,
      deadline,
      type: type || "Upcoming",
      startingDate,
      prizes,
      participationType
    });

    return res.status(201).json({ msg: "Contest created successfully", data: newContest });
  } catch (error) {
    console.error("DETAILED ERROR:", error); // Check Vercel logs for this!
    return res.status(500).json({ msg: error.message || "Internal Server Error" });
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


const updateContest = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      brief: req.body.brief,
      startingDate: new Date(req.body.startingDate),
      deadline: new Date(req.body.deadline),
      type: req.body.type,
      prizes: Number(req.body.prizes),
      participationType: req.body.participationType
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedContest = await Contest.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedContest) {
      return res.status(404).json({ msg: "Contest not found" });
    }

    return res.status(200).json({
      msg: "Contest updated successfully",
      data: updatedContest,
    });

  } catch (error) {
    console.error("UPDATE ERROR:", error); // 🔥 MUST LOG

    return res.status(500).json({
      msg: "Something went wrong from server",
      error: error.message,
    });
  }
};
export { createContest,deleteContest,updateContest};