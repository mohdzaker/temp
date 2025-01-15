import express from "express";
import sendOtpCode from "../controllers/admin/sendOtpCode.js";
import verifyOtpCode from "../controllers/admin/verifyOtpCode.js";
import rateLimitMiddleware from "../middlewares/rateLimit.js";

const adminRouter = express.Router();

adminRouter.post("/sendOtpCode", rateLimitMiddleware, sendOtpCode);
adminRouter.post("/verifyOtpCode", verifyOtpCode);

export default adminRouter;