import express from "express";
import sendOtpCode from "../controllers/admin/sendOtpCode.js";
import verifyOtpCode from "../controllers/admin/verifyOtpCode.js";

const adminRouter = express.Router();

userRouter.post("/sendOtpCode", sendOtpCode);
userRouter.post("/verifyOtpCode", verifyOtpCode);

export default adminRouter;