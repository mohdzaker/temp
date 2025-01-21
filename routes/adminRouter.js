import express from "express";
import adminRegister from "../controllers/admin/auth/register/index.js";
import adminLogin from "../controllers/admin/auth/login/index.js";
import authAdmin from "../middlewares/authAdmin.js";
import setConfig from "../controllers/admin/config/index.js";
import { addOffer, deleteOffer, editOffer, getAllOffers } from "../controllers/admin/offer/index.js";
import { addEvent, editEvent, getAllOffersWithEvents, getOfferByIdWithEvents } from "../controllers/admin/event/index.js";

const adminRouter = express.Router();

adminRouter.post("/auth/register", adminRegister);
adminRouter.post("/auth/login", adminLogin);
adminRouter.post("/config", authAdmin, setConfig);
adminRouter.post("/offer/add", authAdmin, addOffer);
adminRouter.post("/offer/edit", authAdmin, editOffer);
adminRouter.post("/offer/delete", authAdmin, deleteOffer);
adminRouter.post("/offer", authAdmin, getAllOffers);
adminRouter.post("/event/add", authAdmin, addEvent);
adminRouter.post("/event/edit", authAdmin, editEvent);
adminRouter.post("/event/get-all-offers", getAllOffersWithEvents);
adminRouter.post("/event/get-offer", getOfferByIdWithEvents);


export default adminRouter;