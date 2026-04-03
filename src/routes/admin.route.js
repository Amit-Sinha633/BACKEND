import { Router} from "express";
import { checkRole } from "../middleware/auth.middleware.js";
import { createContest } from "../controllers/contest.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
// import upload from "../middleware/multer.middleware.js";
import { getAllContest } from "../controllers/auth.controller.js";
const contestRouter = Router()

contestRouter.route("/create-contest").post(
    verifyJwt,
    checkRole,
    // upload.fields([
    //     {
    //         name: "image",
    //         maxCount: 1,
    //     }
    // ]),
    createContest
)
contestRouter.route("/get-all-contest").post(verifyJwt,getAllContest)
export default contestRouter