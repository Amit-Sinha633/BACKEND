
import { User } from "../models/user.model.js"
import { Team } from "../models/team.model.js"
import { Contest } from "../models/contest.model.js";


const teamMaking = async (req, res) => {
  try {
    const createdTeamBy = req.user;
    const { name, member } = req.body;

    if (!name || !member) {
      return res.status(400).json({
        msg: "All fields are required",
      });
    }

    const teamName = await Team.findOne({ name });
    if (teamName) {
      return res.status(400).json({
        msg: "Team name already exists",
      });
    }

    const existingPartner = await User.findOne({ email: member });

    if (!existingPartner) {
      return res.status(400).json({
        msg: "Partner email does not exist",
      });
    }

    if (
      createdTeamBy._id.toString() === existingPartner._id.toString()
    ) {
      return res.status(400).json({
        msg: "You cannot add yourself as teammate",
      });
    }

    const members = [createdTeamBy._id, existingPartner._id];

    const existingTeam = await Team.findOne({
      members: { $in: members },
    });

    if (existingTeam) {
      return res.status(400).json({
        msg: "One of the users is already in a team",
      });
    }

    const newTeam = await Team.create({
      name,
      members,
      createdBy: createdTeamBy._id,
    });

    return res.status(201).json({
      msg: "Team created successfully",
      data: newTeam,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Something went wrong while creating a team",
      error,
    });
  }
};



export {teamMaking}