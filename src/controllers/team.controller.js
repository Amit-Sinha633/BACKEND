import { Contest } from "../models/contest.model.js";
import { User } from "../models/user.model.js";
import { Team } from "../models/team.model.js";
import { Participate } from "../models/perticipate.model.js";
import { TeamInvite } from "../models/teamInvite.model.js";

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

    /* ================= TEAM NAME ================= */
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
      members: [], // 🔥 no members initially
      createdTeamBy,
    });

    /* ================= CREATE PARTICIPATION ================= */
    await Participate.create({
      contest: contestId,
      team: newTeam._id,
    });

    /* ================= SEND INVITES ================= */
    if (contest.participationType === "team") {
      await TeamInvite.insertMany(
        partnerIds.map((userId) => ({
          team: newTeam._id,
          sender: createdTeamBy,
          receiver: userId,
          status: "pending",
        }))
      );
    }

    /* ================= RESPONSE ================= */
    return res.status(201).json({
      msg:
        contest.participationType === "solo"
          ? "Solo team created successfully"
          : "Team created. Invitations sent to members.",
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

const acceptInvite = async (req, res) => {
  try {
    const { inviteId } = req.params;
    const userId = req.user._id;

    const invite = await TeamInvite.findById(inviteId);

    if (!invite) {
      return res.status(404).json({ msg: "Invite not found" });
    }

    if (invite.receiver.toString() !== userId.toString()) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    if (invite.status !== "pending") {
      return res.status(400).json({ msg: "Invite already handled" });
    }

    // ✅ Add user to team
    await Team.findByIdAndUpdate(invite.team, {
      $addToSet: { members: userId },
    });

    // ✅ Update invite
    invite.status = "accepted";
    await invite.save();

    return res.json({ msg: "Joined team successfully" });

  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const rejectInvite = async (req, res) => {
  try {
    const { inviteId } = req.params;
    const userId = req.user._id;

    const invite = await TeamInvite.findById(inviteId);

    if (!invite) {
      return res.status(404).json({ msg: "Invite not found" });
    }

    if (invite.receiver.toString() !== userId.toString()) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    invite.status = "rejected";
    await invite.save();
    const teamId = invite.team.toString()
    console.log(teamId)
    const deletedTeam = await Team.findByIdAndDelete(teamId)
    const deleteParticipate = await Participate.findOneAndDelete({team:teamId})
    console.log(deleteParticipate)
    return res.json({ msg: "Invite rejected" });

  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const getMyInvites = async (req, res) => {
  try {
    const userId = req.user._id;

    const invites = await TeamInvite.find({
      receiver: userId,
      status: "pending",
    }).populate("team sender");

    return res.json(invites);

  } catch (error) {
    return res.status(500).json({ msg: error.message });
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
export { teamMaking,teams,updateTeam,deleteTeam,acceptInvite,rejectInvite,getMyInvites};