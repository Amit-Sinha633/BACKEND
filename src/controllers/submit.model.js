import { Contest } from "../models/contest.model.js"
import { Submit } from "../models/submit.model.js"
import { Team } from "../models/team.model.js"


const submitProject = async(req,res)=>{
   try {
     const {teamName,contest,githubLink,liveLink} = req.body
    if(!teamName || !contest || !liveLink){
        return res.status(400).json({
            msg: "All fields are required"
        })
    }
    const existingTeamName = await Team.findOne({title:teamName})
    const existingContest = await Contest.findOne({title:contest})
    if(!existingTeamName || !(existingContest.type === "Ongoing")){
        return res.status(400).json({
            msg: "you cannot submit your project"
        })
    }
    const newSubmit = await Submit.create({teamName,contest,githubLink,liveLink})
    return res.ststus(201).json({
        msg: "your project submitted",
        data: newSubmit
    })
   } catch (error) {
    return res.status(500).json({
        msg: 'Something went wrong from surver side'
    })
   }
}

export {submitProject}