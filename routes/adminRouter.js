import express from "express";
import sendOtpCode from "../controllers/admin/auth/sendOtpCode.js";
import verifyOtpCode from "../controllers/admin/auth/verifyOtpCode.js";
import rateLimitMiddleware from "../middlewares/rateLimit.js";
import authAdmin from "../middlewares/authAdmin.js";
import addOffer from "../controllers/admin/offer/addOffer.js";
import editOffer from "../controllers/admin/offer/editOffer.js";
import deleteOffer from "../controllers/admin/offer/deleteOffer.js";
import addEvent from "../controllers/admin/event/addEvent.js";
import editEvent from "../controllers/admin/event/editEvent.js";
import deleteEvent from "../controllers/admin/event/deleteEvent.js";

const adminRouter = express.Router();

adminRouter.post("/sendOtpCode", rateLimitMiddleware, sendOtpCode);
adminRouter.post("/verifyOtpCode", verifyOtpCode);
adminRouter.post("/addOffer", authAdmin, addOffer);
adminRouter.post("/editOffer", authAdmin, editOffer);
adminRouter.post("/deleteOffer", authAdmin, deleteOffer);
adminRouter.post("/addEvent", authAdmin, addEvent);
adminRouter.post("/editEvent", authAdmin, editEvent);
adminRouter.post("/deleteEvent", authAdmin, deleteEvent);

export default adminRouter;