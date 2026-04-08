
import { User } from "../models/user.model.js"
import { Team } from "../models/team.model.js"


const teamMaking = async (req, res) => {
  try {
    const createdTeamBy = req.user._id;
    let { name, members } = req.body;

    if (!name || !members) {
      return res.status(400).json({
        msg: "All fields are required",
      });
    }

    if (!Array.isArray(members)) {
      return res.status(400).json({
        msg: "Members should be an array",
      });
    }

    members = members.filter(email => email.trim() !== "");

    if (members.length === 0) {
      return res.status(400).json({
        msg: "Add valid member emails",
      });
    }

    const teamName = await Team.findOne({ name });
    if (teamName) {
      return res.status(400).json({
        msg: "Team name already exists",
      });
    }

    const existingPartner = await User.find({
      email: { $in: members }
    });

    // ✅ FIXED
    if (existingPartner.length !== members.length) {
      return res.status(400).json({
        msg: "Some emails are not registered users",
      });
    }

    const partnerIds = existingPartner.map(user => user._id);

    const isSelfIncluded = partnerIds.some(
      id => id.toString() === createdTeamBy.toString()
    );

    if (isSelfIncluded) {
      return res.status(400).json({
        msg: "You cannot add yourself as teammate",
      });
    }

    const existingTeam = await Team.findOne({
      members: { $in: partnerIds }
    });

    if (existingTeam) {
      return res.status(400).json({
        msg: "One of the users is already in a team",
      });
    }

    const newTeam = await Team.create({
      name,
      members: partnerIds,
      createdTeamBy,
    });

    return res.status(201).json({
      msg: "Team created successfully",
      data: newTeam,
    });

  } catch (error) {
    console.error("TEAM ERROR:", error.message);

    return res.status(500).json({
      msg: "Something went wrong while creating a team",
      error: error.message,
    });
  }
};



export {teamMaking}