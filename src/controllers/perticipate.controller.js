import { Team } from "../models/team.model.js"
import { Contest } from "../models/contest.model.js"
import { Participate } from "../models/perticipate.model.js"
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

if (contest.participationType === "team") {
  const { teamId } = req.body; // Expect teamId from frontend

  if (!teamId) {
    return res.status(400).json({
      msg: "This contest requires a team. Redirecting to team creation.",
      redirect: true, // Hint for frontend
    });
  }

  // Check if team already joined
  const alreadyJoined = await Participate.findOne({
    team: teamId,
    contest: contestId,
  });

  if (alreadyJoined) {
    return res.status(400).json({ msg: "Team already participated" });
  }

  const entry = await Participate.create({
    team: teamId, // Ensure your Participate model has a 'team' field
    contest: contestId,
  });

  return res.status(201).json({
    msg: "Team joined successfully",
    data: entry,
  });
}

  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Something went wrong",
    });
  }
};

export {teamParticipatingInContest}