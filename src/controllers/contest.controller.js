import { Contest } from "../models/contest.model.js";

const createContest = async (req, res) => {
  try {
    const { title, description, brief, deadline, type, startingDate, prizes } = req.body;
    
    // Check if file exists safely
    const image = req.file?.path; 

    if (!title || !description || !brief || !deadline || !startingDate || !prizes || !image) {
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
      prizes
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

// const updateContest = async(req,res) =>{
//   try {
//     const {id} = req.params
//     const newContest = await Contest.findByIdAndUpdate(
//       id,
//       req.body,
//       {returnDocument: "after"}
//     )
//     if(!newContest){
//       return res.status(400).json({
//         msg: "No contest found"
//       })
//     }
//     return res.status(200).json({
//       msg: "Contest updated successfully",
//       data: newContest
//     })
//   } catch (error) {
//     return res.status(500).json({
//       msg: "Somethig went wrong from surver"
//     })
//   }
// }

const updateContest = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("BODY:", req.body); // 🔍 debug
    console.log("FILE:", req.file); // 🔍 debug

    const {
      title,
      description,
      brief,
      startingDate,
      deadline,
      type,
      prizes,
    } = req.body;

    const updateData = {
      title,
      description,
      brief,
      startingDate,
      deadline,
      type,
      prizes,
    };

    // ✅ handle image if uploaded
    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedContest = await Contest.findByIdAndUpdate(
      id,
      updateData,
      { returnDocument:"after" } // 🔥 IMPORTANT
    );

    if (!updatedContest) {
      return res.status(404).json({
        msg: "No contest found",
      });
    }

    return res.status(200).json({
      msg: "Contest updated successfully",
      data: updatedContest,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Something went wrong from server",
      error: error.message,
    });
  }
};
export { createContest,deleteContest,updateContest};