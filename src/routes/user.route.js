import { Router } from "express";
import { forgetPassword, getAllContest, getProfile, registerUser} from "../controllers/auth.controller.js";
import { logInUser } from "../controllers/auth.controller.js";
import { logOutUser } from "../controllers/auth.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { teamMaking } from "../controllers/team.controller.js";
import { teamParticipatingInContest } from "../controllers/perticipate.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/logInUser").post(logInUser);
router.route("/logOutUser").post(verifyJwt,logOutUser)
router.route("/get-profile").post(verifyJwt,getProfile);
router.route("/forget-password").post(forgetPassword)
router.route("/team-making").post(verifyJwt,teamMaking)
router.route("/perticipating").post(teamParticipatingInContest)
router.route("/get-all-contest").post(verifyJwt,getAllContest)
export default router;
