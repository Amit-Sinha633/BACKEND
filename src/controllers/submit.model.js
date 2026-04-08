import { Contest } from "../models/contest.model.js"
import { Participate } from "../models/perticipate.model.js";
import { Submit } from "../models/submit.model.js"
import { Team } from "../models/team.model.js"


// const submitProject = async (req, res) => {
//   try {
//     const { teamName, githubLink, liveLink } = req.body;
//     const { contestId } = req.params;

//     if (!teamName || !contestId || !liveLink) {
//       return res.status(400).json({
//         msg: "All fields are required",
//       });
//     }

//     // ✅ Check team exists
//     const team = await Team.findOne(teamName);
//     if (!team) {
//       return res.status(404).json({
//         msg: "Team not found",
//       });
//     }

//     // ✅ Check contest exists
//     const contest = await Contest.findById(contestId);
//     if (!contest) {
//       return res.status(404).json({
//         msg: "Contest not found",
//       });
//     }

//     // ✅ Optional: Check contest is ongoing
//     // if (contest.status !== "ongoing") {
//     //   return res.status(400).json({
//     //     msg: "Contest is not active",
//     //   });
//     // }
//     // const existingUser = await Team.findOne(members.includes=req.user._id)
//     if (!team.members.includes(req.user._id)) {
//   return res.status(403).json({
//     msg: "You are not part of this team",
//   });
// }
//     // ✅ Prevent duplicate submission
//     const alreadySubmitted = await Submit.findOne({
//       teamName: teamName._id,
//       contest: contestId,
//     });

//     if (alreadySubmitted) {
//       return res.status(400).json({
//         msg: "Project already submitted",
//       });
//     }

//     // ✅ Create submission
//     const newSubmit = await Submit.create({
//       teamName: teamName._id,
//       contest: contestId,
//       githubLink,
//       liveLink,
//     });

//     return res.status(201).json({
//       msg: "Your project submitted successfully",
//       data: newSubmit,
//     });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       msg: "Something went wrong from server side",
//     });
//   }
// };


const submitProject = async (req, res) => {
  try {
    const { teamName, githubLink, liveLink } = req.body;
    const { contestId } = req.params;

    /* ================= VALIDATION ================= */
    if (!teamName || !contestId || !liveLink) {
      return res.status(400).json({
        msg: "All fields are required",
      });
    }

    /* ================= TEAM ================= */
    const team = await Team.findById(teamName);
    if (!team) {
      return res.status(404).json({ msg: "Team not found" });
    }

    /* ================= CONTEST ================= */
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ msg: "Contest not found" });
    }

    /* ================= PARTICIPATION CHECK ================= */
    const isParticipating = await Participate.findOne({
      team: team._id,
      contest: contestId,
    });

    if (!isParticipating) {
      return res.status(400).json({
        msg: "Team is not participating in this contest",
      });
    }

    /* ================= USER IN TEAM ================= */
    if (!team.members.includes(req.user.email)) {
      return res.status(403).json({
        msg: "You are not part of this team",
      });
    }

    /* ================= ALREADY SUBMITTED ================= */
    const alreadySubmitted = await Submit.findOne({
      teamName: team._id,
      contest: contestId,
    });

    if (alreadySubmitted) {
      return res.status(200).json({
        msg: "Project already submitted",
        isSubmitted: true, // 🔥 ADD THIS
        data: alreadySubmitted,
      });
    }

    /* ================= CREATE SUBMISSION ================= */
    const newSubmit = await Submit.create({
      teamName: team._id,
      contest: contestId,
      githubLink,
      liveLink,
    });

    /* ================= RESPONSE ================= */
    return res.status(201).json({
      msg: "Your project submitted successfully",
      isSubmitted: true, // 🔥 ADD THIS
      data: newSubmit,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Something went wrong from server side",
    });
  }
};



export {submitProject}