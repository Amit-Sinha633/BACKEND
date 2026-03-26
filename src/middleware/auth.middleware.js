import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
const verifyJwt = async(req,res,next) => {
    try {
        const token = req.cookies?.accessToken
        if(!token){
            return res.status(400).json({
                msg:"no token found"
            })
        }
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken.userId)
        req.user = user
        next()
    } catch (error) {
        return res.status(500).json({
            msg:"Something went wrong from surver side"
        })
    }
}

export {verifyJwt}
