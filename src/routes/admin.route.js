import { Router} from "express";
import { checkRole } from "../middleware/auth.middleware.js";
import { createContest, deleteContest, updateContest } from "../controllers/contest.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";
import { deleteUser, getAllContest, getAllUsers, updateUser } from "../controllers/auth.controller.js";
import {winnerController} from "../controllers/winner.controller.js"
import { getAllParticipantsAsTeam } from "../controllers/perticipate.controller.js";

const contestRouter = Router()

contestRouter.route("/create-contest").post(
  verifyJwt,
  checkRole,
  upload.single("image"),
  createContest
);
contestRouter.route("/get-all-contest").get(verifyJwt,getAllContest)
contestRouter.route("/get-all-users").get(verifyJwt,getAllUsers)
contestRouter.route("/delete-user/:id").delete(verifyJwt,deleteUser)
contestRouter.route("/update-user/:id").patch(verifyJwt,updateUser)
contestRouter.route("/update-contest/:id").patch(
  verifyJwt,
  upload.single("image"), // ✅ VERY IMPORTANT
  updateContest
);
contestRouter.route("/delete-contest/:id").delete(verifyJwt,deleteContest)
contestRouter.route("/contest/:contestId").get(verifyJwt,checkRole,getAllParticipantsAsTeam)

// contestRouter.route("/winner-contest/:id").post(verifyJwt,checkRole,winnerController)
export default contestRouter