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
        console.log(req.user)
        next()
    } catch (error) {
        return res.status(500).json({
            msg:"Something went wrong from surver side"
        })
    }
}

const checkRole = (req, res, next) => {
    try {
        console.log("req.user:", req.user) 

        if (!req.user) {
            return res.status(401).json({
                msg: "User not exist"
            })
        }

        if (req.user.role === "user") {
            return res.status(403).json({
                msg: "You are not authorized to create a contest"
            })
        }
        next()
    } catch (error) {
        return res.status(500).json({
            msg: "Something went wrong while checking role"
        })
    }
}
export {verifyJwt,checkRole}
