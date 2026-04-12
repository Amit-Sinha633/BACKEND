import { User } from "../models/user.model.js";
import { Team } from "../models/team.model.js";
import { Contest } from "../models/contest.model.js";
import { Participate } from "../models/perticipate.model.js";

const teamMaking = async (req, res) => {
  try {
    const createdTeamBy = req.user._id;
    let { name, members = [] } = req.body;
    const { contestId } = req.params;

    /* ================= VALIDATION ================= */
    if (!name) {
      return res.status(400).json({
        msg: "Team name is required",
      });
    }

    /* ================= GET CONTEST ================= */
    const contest = await Contest.findById(contestId);

    if (!contest) {
      return res.status(404).json({
        msg: "Contest not found",
      });
    }

    /* ================= TEAM NAME (PER CONTEST) ================= */
    const existingTeamName = await Team.findOne({ name });

    if (existingTeamName) {
      return res.status(400).json({
        msg: "Team name already exists",
      });
    }

    /* ================= CLEAN MEMBERS ================= */
    if (!Array.isArray(members)) {
      return res.status(400).json({
        msg: "Members should be an array",
      });
    }

    members = members.filter((email) => email.trim() !== "");

    /* ================= CONTEST RULES ================= */

    // SOLO
    if (contest.participationType === "solo") {
      if (members.length > 0) {
        return res.status(400).json({
          msg: "Solo contest does not allow members",
        });
      }
    }

    // TEAM
    if (contest.participationType === "team") {
      if (members.length === 0) {
        return res.status(400).json({
          msg: "Team contest requires at least one member",
        });
      }
    }

    /* ================= GET USERS ================= */
    const existingUsers = await User.find({
      email: { $in: members },
    });

    if (existingUsers.length !== members.length) {
      return res.status(400).json({
        msg: "Some emails are not registered users",
      });
    }

    const partnerIds = existingUsers.map((user) => user._id);

    /* ================= PREVENT SELF ADD ================= */
    const isSelfIncluded = partnerIds.some(
      (id) => id.toString() === createdTeamBy.toString()
    );

    if (isSelfIncluded) {
      return res.status(400).json({
        msg: "You cannot add yourself as teammate",
      });
    }

    /* ================= ALL USERS ================= */
    const allUsers = [...partnerIds, createdTeamBy];

    /* ================= CHECK PARTICIPATION ================= */
    const participations = await Participate.find({
      contest: contestId,
    }).populate("team");

    const isAlreadyEngaged = participations.some((p) => {
      const team = p.team;

      if (!team) return false;

      return allUsers.some((userId) => {
        return (
          team.createdTeamBy.toString() === userId.toString() ||
          team.members.some(
            (memberId) => memberId.toString() === userId.toString()
          )
        );
      });
    });

    if (isAlreadyEngaged) {
      return res.status(400).json({
        msg: "One or more users already joined this contest",
      });
    }

    /* ================= CREATE TEAM ================= */
    const newTeam = await Team.create({
      name,
      members: partnerIds, // empty for solo
      createdTeamBy,
    });

    /* ================= CREATE PARTICIPATION ================= */
    await Participate.create({
      contest: contestId,
      team: newTeam._id,
    });

    /* ================= RESPONSE ================= */
    return res.status(201).json({
      msg: "Team created successfully",
      data: newTeam,
    });

  } catch (error) {
    console.error("TEAM ERROR:", error.message);

    return res.status(500).json({
      msg: "Something went wrong",
      error: error.message,
    });
  }
};
const teams = async(req,res) =>{
  const existingTeams = await Team.find().populate("members").populate("createdTeamBy")
  return res.status(200).json({
    msg: "these are the existing teams",
    data: existingTeams
  })
}
const updateTeam = async(req,res) =>{
  const {teamId} = req.params
  const update = await Team.findByIdAndUpdate(teamId,
    req.body,
    {new: true}
  )
  return res.status(200).json({
    msg: "team updated Successfully",
    data: update
  })
}
const deleteTeam = async(req,res) =>{
  const {teamId} = req.params
  const teamDelete = await Team.findByIdAndDelete(teamId)
  return res.status(200).json({
    msg: "team deleted successfully",
    data: teamDelete
  })
}
export { teamMaking,teams,updateTeam,deleteTeam };