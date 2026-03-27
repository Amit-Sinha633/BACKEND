import { Contest } from "../models/contest.model.js"


const createContest = async(req,res) =>{
    try {
        const {title,description,brief,image,deadline,type,rewards} = req.user
        if(!title || !description || !brief || !deadline || !type || !rewards){
            return res.status(400).json({
                msg: "All fields are required"
            })
            const existingContest = await Contest.findOne({title})
            if(existingContest){
                return res.status(400).json({
                    msg: "Contest already created"
                })
            }
        }
    } catch (error) {
        
    }
}