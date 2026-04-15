import { Router } from "express";
import { forgetPassword, getAllContest, getProfile, perticipatedIn, registerUser} from "../controllers/auth.controller.js";
import { logInUser } from "../controllers/auth.controller.js";
import { logOutUser } from "../controllers/auth.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { getMyInvites, teamMaking } from "../controllers/team.controller.js";
import {  teamParticipatingInContestAsTeam } from "../controllers/perticipate.controller.js";
import { submitProject} from "../controllers/submit.controller.js";
import { showWiners } from "../controllers/winner.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/logInUser").post(logInUser);
router.route("/logOutUser").post(verifyJwt,logOutUser)
router.route("/get-profile").post(verifyJwt,getProfile);
router.route("/forget-password").post(forgetPassword)

router.route("/team-making/:contestId").post(verifyJwt,teamMaking)

router.route("/perticipate-as-team/:contestId").post(teamParticipatingInContestAsTeam)
router.route("/get-all-contest").get(getAllContest)
router.route("/submit-project-as-team/:contestId").post(verifyJwt,submitProject)

router.route("/perticipents-in").get(verifyJwt,perticipatedIn)
router.route("/winners").get(verifyJwt,showWiners)
router.route("/get-invitation").get(verifyJwt,getMyInvites)


export default router; 