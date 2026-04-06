import { Router} from "express";
import { checkRole } from "../middleware/auth.middleware.js";
import { createContest, deleteContest, updateContest } from "../controllers/contest.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";
import { deleteUser, getAllContest, getAllUsers, updateUser } from "../controllers/auth.controller.js";
const contestRouter = Router()

contestRouter.route("/create-contest").post(
  verifyJwt,
  checkRole,
  upload.single("image"),
  createContest
);
contestRouter.route("/get-all-contest").get(verifyJwt,getAllContest)
contestRouter.route("/get-all-users").post(verifyJwt,getAllUsers)
contestRouter.route("/delete-user/:id").delete(verifyJwt,deleteUser)
contestRouter.route("/update-user/:id").patch(verifyJwt,updateUser)
contestRouter.route("/update-contest/:id").patch(verifyJwt,updateContest)
contestRouter.route("/delete-contest/:id").delete(verifyJwt,deleteContest)
export default contestRouter