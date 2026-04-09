import { Contest } from "../models/contest.model.js";
import { Participate } from "../models/perticipate.model.js";
import { Submit } from "../models/submit.model.js";
import { Team } from "../models/team.model.js";
import { User } from "../models/user.model.js";

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
    const team = await Team.findOne({name:teamName});
    if (!team) {
      return res.status(404).json({ msg: "Team not found" });
    }

    /* ================= CONTEST ================= */
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ msg: "Contest not found" });
    }

    /* ================= USER IN TEAM (FIXED 🔥) ================= */
    if (!(team.createdBy  === req.user._id)) {
      return res.status(403).json({
        msg: "You are not authorized to submit for this team",
      });
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
    // contest type
    if(!(contest.type === "Ongoing")){
      return res.status(400).json({
        msg: "You are not authorized to submit"
      })
    }
    /* ================= ALREADY SUBMITTED ================= */
    const alreadySubmitted = await Submit.findOne({
      teamName: team._id,
      contest: contestId,
    });

    if (alreadySubmitted) {
      return res.status(200).json({
        msg: "Project already submitted",
        isSubmitted: true,
        data: alreadySubmitted,
      });
    }

    /* ================= CREATE ================= */
    const newSubmit = await Submit.create({
      teamName: team._id,
      contest: contestId,
      githubLink,
      liveLink,
    });

    return res.status(201).json({
      msg: "Your project submitted successfully",
      isSubmitted: true,
      data: newSubmit,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Something went wrong from server side",
    });
  }
};
const submitProjectAsSolo = async (req, res) => {
  try {
    const {  githubLink, liveLink } = req.body;
    const { contestId } = req.params;
    const {userId} = req.user._id  
      /* ================= VALIDATION ================= */
    if (!contestId || !liveLink) {
      return res.status(400).json({
        msg: "All fields are required",
      });
    }

    /* ================= TEAM ================= */
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "Team not found" });
    }

    /* ================= CONTEST ================= */
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ msg: "Contest not found" });
    }

    
    /* ================= PARTICIPATION CHECK ================= */
    const isParticipating = await Participate.findOne({
      user: userId,
      contest: contestId,
    });

    if (!isParticipating) {
      return res.status(400).json({
        msg: "you are not participating in this contest",
      });
    }
    // contest type
    if(!(contest.type === "Ongoing")){
      return res.status(400).json({
        msg: "You are not authorized to submit"
      })
    }
    /* ================= ALREADY SUBMITTED ================= */
    const alreadySubmitted = await Submit.findOne({
      user: userId,
      contest: contestId,
    });

    if (alreadySubmitted) {
      return res.status(200).json({
        msg: "Project already submitted",
        isSubmitted: true,
        data: alreadySubmitted,
      });
    }

    /* ================= CREATE ================= */
    const newSubmit = await Submit.create({
      user: userId,
      contest: contestId,
      githubLink,
      liveLink,
    });

    return res.status(201).json({
      msg: "Your project submitted successfully",
      isSubmitted: true,
      data: newSubmit,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Something went wrong from server side",
    });
  }
};

export { submitProject,submitProjectAsSolo };