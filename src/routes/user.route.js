import { Router } from "express";
import { forgetPassword, getAllContest, getProfile, registerUser} from "../controllers/auth.controller.js";
import { logInUser } from "../controllers/auth.controller.js";
import { logOutUser } from "../controllers/auth.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { teamMaking } from "../controllers/team.controller.js";
import { teamParticipatingInContest, teamParticipatingInContestAsTeam } from "../controllers/perticipate.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/logInUser").post(logInUser);
router.route("/logOutUser").post(verifyJwt,logOutUser)
router.route("/get-profile").post(verifyJwt,getProfile);
router.route("/forget-password").post(forgetPassword)
router.route("/team-making").post(teamMaking)
router.route("/perticipating/:contestId").post(verifyJwt,teamParticipatingInContest)
router.route("/perticipate-as-team/:contestId").post(teamParticipatingInContestAsTeam)
router.route("/get-all-contest").get(getAllContest)






export default router;
