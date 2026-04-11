import { Team } from "../models/team.model.js"
import { Contest } from "../models/contest.model.js"
import { Participate } from "../models/perticipate.model.js"
import { perticipatedIn } from "./auth.controller.js";
import { User } from "../models/user.model.js";

const teamParticipatingInContestAsTeam = async (req, res) => {
  try {
    const { teamId } = req.body;   // ✅ FIXED
    const { contestId } = req.params;

    if (!teamId) {
      return res.status(400).json({
        msg: "Team ID is required",
      });
    }

    const contest = await Contest.findById(contestId);

    if (!contest) {
      return res.status(404).json({
        msg: "Contest not found",
      });
    }

    

    // ✅ Check already participated
    const alreadyJoined = await Participate.findOne({
      team: teamId,
      contest: contestId,
    });

    if (alreadyJoined) {
      return res.status(400).json({
        msg: "Already participated",
      });
    }

    const entry = await Participate.create({
      team: teamId,
      contest: contestId,
    });

    return res.status(201).json({
      msg: "Joined as team",
      data: entry,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Something went wrong",
    });
  }
};

const getAllParticipantsAsTeam = async (req, res) => {
  try {
    const { contestId } = req.params;
    const participants = await Participate.find({
      contest: contestId,
    }).select("team")
     .populate("team", "name createdBy")   // team name

console.log(participants)
    return res.status(200).json({
      msg: "Participants of this contest",
      data: participants
      
    });

  } catch (error) {
    return res.status(500).json({
      msg: "Something went wrong",
    });
  }
};
 
export {teamParticipatingInContestAsTeam,getAllParticipantsAsTeam}