
import { Submit } from "../models/submit.model.js"
import { Winner } from "../models/winner.model.js"


const winnerController = async(req,res) =>{
    const {position,contestName,prizeMoney,quality,creativity,completion,usability} = req.body
   if(!position || !contestName || !prizeMoney || !quality || !creativity || !completion || !usability){
    return res.status(400).json({
        msg: "All fields are required"
    })
   }
   const existing = await Submit.findOne({teamName,contest})
   if(!existing){
    return res.status(400).json({
        msg: "Contest or team does not exist"
    })
   }
   const newWinner = await Winner.create({position,contestName,prizeMoney,quality,creativity,completion,usability})
   return res.status(201).json({
    msg: "Winner created successfully",
    data:newWinner
   })
}

export {winnerController}