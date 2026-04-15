import { Contest } from "../models/contest.model.js";
import { Participate } from "../models/perticipate.model.js";
import { Submit } from "../models/submit.model.js";
import { Team } from "../models/team.model.js";
import { User } from "../models/user.model.js";

const submitProject = async (req, res) => {
  try {
    const {githubLink, liveLink } = req.body;
    const { contestId } = req.params;
    const {userId} = req.user._id
    /* ================= VALIDATION ================= */
    if ( !contestId || !liveLink) {
      return res.status(400).json({
        msg: "All fields are required",
      });
    }

    const userTeam = await Team.find({createdTeamBy:userId})
    const mappedTeams = userTeam.map(team => {
  return {
    teamId: team._id,
  };
});
    /* ================= PARTICIPATION CHECK ================= */
    const isParticipating = await Participate.findOne({
      team: mappedTeams.teamId,
      contest: contestId,
    });

    if (!isParticipating) {
      return res.status(400).json({
        msg: "Team is not participating in this contest",
      });
    }
    const presentContest = await Contest.fondOne({_id:contestId})
    if(!presentContest){
      return res.status(400).json({
        msg: "no contest found"
      })
    }
    if(!(presentContest.type === "Ongoing")){
      return res.status(400).json({
        msg: "You are not authorized to submit because it's type is not ongoing contest"
      })
    }
    /* ================= ALREADY SUBMITTED ================= */
    const alreadySubmitted = await Submit.findOne({
      team: mappedTeams.teamId,
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
      team: mappedTeams.teamId,
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

const getAllSubmitProjects = async(req,res) =>{
  const {contestId} = req.params
  if(!contestId){
    return res.status(400).json({
      msg: "Contest Id is required"
    })
  }
  const submitions = await Submit.find({
    contest: contestId
  }).select("teamName liveLink githubLink").populate("teamName")
   const projects = submitions.map(project=>project)
  return res.status(200).json({
    mag: projects
  })
}
export { submitProject,getAllSubmitProjects};