import { Contest } from "../models/contest.model.js";
import { Participate } from "../models/perticipate.model.js";
import { Submit } from "../models/submit.model.js";
import { Team } from "../models/team.model.js";

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

    /* ================= USER IN TEAM (FIXED 🔥) ================= */
    if (!team.members.includes(req.user._id)) {
      return res.status(403).json({
        msg: "You are not part of this team",
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

export { submitProject };