import express from "express";

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
    res.send("Hello from user router!")
})

export default userRouter;