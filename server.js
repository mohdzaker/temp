import express from "express";
import { connectToDb } from "./config/index.js";
import userRouter from "./routes/userRouter.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/user", userRouter);

;(async ()=>{
    try {
        await connectToDb();
        app.listen(PORT, ()=> console.log(`Server is listening to port ${PORT}`))
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
})();