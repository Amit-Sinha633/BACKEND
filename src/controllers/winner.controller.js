
import { Contest } from "../models/contest.model.js"
import { Submit } from "../models/submit.model.js"
import { Winner } from "../models/winner.model.js"
import {Team} from "../models/team.model.js"
import {Participate} from "../models/perticipate.model.js"
const winnerController = async(req,res) =>{
    const {position,prizeMoney,quality,creativity,completion,usability} = req.body
    const {teamName} = req.params

   if(!position || !teamName || !prizeMoney || !quality || !creativity || !completion || !usability){
    return res.status(400).json({
        msg: "All fields are required"
    })
   }
   const team = await Team.findOne({
    name: teamName
   })
   if(!team){
    return res.status(400).json({
        msg: "team not found"
    })
   }
   const teamId = team._id
   const perticipation = await Participate.findOne({team:teamId}).populate("contest")
   console.log("pericipate",perticipation)
   console.log(perticipation.contest.title)

   const existing = await Submit.findOne({teamName:teamId,contest:perticipation.contest._id})
   console.log(existing)
   if(!existing){
    return res.status(400).json({
        msg: "Contest or team does not exist"
    })
   }
   const existingContest = await Contest.findOne({
    title: perticipation.contest.title
   })
   if(!(existingContest.type === "Completed")){
    return res.status(400).json({
        msg : "You cannot declare winner because its not completed"
    })
   }
console.log("teamName",teamId)
   const newWinner = await Winner.create({position,contestName:perticipation.contest._id,teamName:teamId,prizeMoney,quality,creativity,completion,usability})
   return res.status(201).json({
    msg: "Winner created successfully",
    data:newWinner
   })
}

export {winnerController}