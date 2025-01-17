import express from "express";
import authUser from "../middlewares/authUser.js";
import initiate from "../controllers/user/auth/google/initiate.js";
import verify from "../controllers/user/auth/google/verify.js";
import initiatee from "../controllers/user/auth/truecaller/initiate.js";

const userRouter = express.Router();

userRouter.post("/auth/google", initiate);
userRouter.post("/auth/google/verify", verify);
userRouter.post("/auth/truecaller", initiate);

export default userRouter;