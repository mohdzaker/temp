import express from "express";
import sendOtpCode from "../controllers/user/sendOtpCode.js";
import verifyOtpCode from "../controllers/user/verifyOtpCode.js";
import authUser from "../middlewares/authUser.js"
import rateLimitMiddleware from "../middlewares/rateLimit.js";

const userRouter = express.Router();

userRouter.post("/sendOtpCode", rateLimitMiddleware, sendOtpCode);
userRouter.post("/verifyOtpCode", verifyOtpCode);
userRouter.get("/test", authUser, (req, res) => {
    res.send("hello")
});

export default userRouter;