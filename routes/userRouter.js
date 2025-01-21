import express from "express";
import authUser from "../middlewares/authUser.js";
import initiateGoogle from "../controllers/user/auth/google/initiate.js";
import verifyGoogle from "../controllers/user/auth/google/verify.js";
import initiateTrueCaller from "../controllers/user/auth/truecaller/initiate.js";
import initiateTrueCallerCall from "../controllers/user/auth/truecaller-call/initiate.js";
import withdraw from "../controllers/user/withdraw/index.js";
import getUserProfile from "../controllers/user/profile/index.js";
import getReferHistory from "../controllers/user/refer-history/index.js";
import clickHandler from "../controllers/user/click/index.js";
import handlePostback from "../controllers/user/postback/index.js";

const userRouter = express.Router();

userRouter.post("/auth/google", initiateGoogle);
userRouter.post("/auth/google/verify", verifyGoogle);
userRouter.post("/auth/truecaller", initiateTrueCaller);
userRouter.post("/auth/truecaller-call", initiateTrueCallerCall);
userRouter.post("/withdraw", authUser, withdraw);
userRouter.post("/profile", authUser, getUserProfile);
userRouter.post("/refers", authUser, getReferHistory);
userRouter.post("/click", authUser, clickHandler);
userRouter.get("/postback", handlePostback);

export default userRouter;