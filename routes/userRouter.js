import express from "express";
import sendOtpCode from "../controllers/user/sendOtpCode.js";
import verifyOtpCode from "../controllers/user/verifyOtpCode.js";

const userRouter = express.Router();

userRouter.post("/sendOtpCode", sendOtpCode);
userRouter.post("/verifyOtpCode", verifyOtpCode);

export default userRouter;