import { Team } from "../models/team.model.js"
import { Contest } from "../models/contest.model.js"
import { Participate } from "../models/perticipate.model.js"
const teamParticipatingInContest = async(req,res) =>{
    try {
        const {teamName,contestName} = req.body
        if(!teamName || !contestName){
            return res.status(400).json({
                msg: "All field are required"
            })
        }
        const existingName = await Team.findOne({name:teamName})
        const existingContest = await Contest.findOne({title:contestName})
      
        if(!existingName || !existingContest){
            return res.status(400).json({
                msg: "Team or contest is not exist"
            })
        }
        if(!(existingContest.type == "Ongoing")){
            return res.status(400).json({
                msg: "You are not authorized to perticipate this contest"
            })
        }
        const alreadyParticipate = await Participate.findOne({teamName,contestName})
        if(alreadyParticipate){
            return res.status(400).json({
                msg: "You have already perticipated in the contest"
            })
        }
        const newPerticipate = await Participate.create({teamName,contestName}) 
        return res.status(200).json({
            msg: `Now your team ${teamName} is successfully perticipating ${contestName} contest`,
            data: newPerticipate
        })
    } catch (error) {
        return res.status(500).json({
            msg: "Something went wrong while perticipating in any contest",
            msg: error
        })
    }
}

export {teamParticipatingInContest}