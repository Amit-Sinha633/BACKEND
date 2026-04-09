import { Team } from "../models/team.model.js"
import { Contest } from "../models/contest.model.js"
import { Participate } from "../models/perticipate.model.js"
import { perticipatedIn } from "./auth.controller.js";
import { User } from "../models/user.model.js";
const teamParticipatingInContest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { contestId } = req.params;
    
    console.log(contestId)
    const contest = await Contest.findById(contestId);
console.log(userId)
    if (!contest) {
      return res.status(404).json({ msg: "Contest not found" });
    }

    // 🔥 SOLO ONLY
    if (contest.participationType === "solo") {
      const alreadyJoined = await Participate.findOne({
        user: userId,
        contest: contestId,
      });

      if (alreadyJoined) {
        return res.status(400).json({
          msg: "Already participated",
        });
      }

      const entry = await Participate.create({
        user: userId,
        contest: contestId,
      });

      return res.status(201).json({
        msg: "Joined as individual",
        data: entry,
      });
    }

    // 🔥 TEAM → BLOCK
    if (contest.participationType === "team") {
      return res.status(400).json({
        msg: "This contest requires a team. Redirecting to team creation.",
      });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Something went wrong",
    });
  }
};

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

    // ✅ Only allow TEAM contests
    if (contest.participationType !== "team") {
      return res.status(400).json({
        msg: "This contest does not allow team participation",
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
    }).select("team user")
     .populate("team", "name createdBy")   // team name
  .populate("user", "userName email"); // user name + email
console.log(participants)
    return res.status(200).json({
      msg: "Participants of this contest",
      data: participants,
      
    });

  } catch (error) {
    return res.status(500).json({
      msg: "Something went wrong",
    });
  }
};
 
export {teamParticipatingInContest,teamParticipatingInContestAsTeam,getAllParticipantsAsTeam}