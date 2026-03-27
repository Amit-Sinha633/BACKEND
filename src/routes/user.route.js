import { Router } from "express";
import { getProfile, registerUser } from "../controllers/auth.controller.js";
import { logInUser } from "../controllers/auth.controller.js";
import { logOutUser } from "../controllers/auth.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/logInUser").post(logInUser);
router.route("/logOutUser").post(verifyJwt,logOutUser)
router.route("/get-profile").post(verifyJwt,getProfile);
export default router;
