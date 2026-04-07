
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

    const teamName = await Team.findOne({ name });
    if (teamName) {
      return res.status(400).json({
        msg: "Team name already exists",
      });
    }

    const existingPartner = await User.find({
      email: { $in: members }
    });

    if (!existingPartner || existingPartner.length === 0) {
      return res.status(400).json({
        msg: "Partner email does not exist",
      });
    }

    const partnerIds = existingPartner.map(user => user._id);

    // ❌ prevent self adding
    const isSelfIncluded = partnerIds.some(
      id => id.toString() === createdTeamBy._id.toString()
    );

    if (isSelfIncluded) {
      return res.status(400).json({
        msg: "You cannot add yourself as teammate",
      });
    }

    // ❌ check if any member already in team
    const existingTeam = await Team.findOne({
      members: { $in: members }
    });

    if (existingTeam) {
      return res.status(400).json({
        msg: "One of the users is already in a team",
      });
    }

    const newTeam = await Team.create({
      name,
      members,
      createdTeamBy: createdTeamBy._id,
    });

    return res.status(201).json({
      msg: "Team created successfully",
      data: newTeam,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Something went wrong while creating a team",
    });
  }
};



export {teamMaking}