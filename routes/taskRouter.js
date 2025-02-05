import axios from 'axios';
import express from 'express';

const taskRouter = express.Router();

taskRouter.post("/verification", async(req, res) => {
    try {
        const {click_id, platform, device_data} = req.body;

        if(!click_id){
            return res.status(400).json({
                status: "failed",
                message: "Click ID is required"
            });
        }

        if(!platform){
            return res.status(400).json({
                status: "failed",
                message: "Platform is required"
            });
        }

        if(!device_data){
            return res.status(400).json({
                status: "failed",
                message: "Device data is required"
            });
        }

        const data = {
            click_id,
            platform,
            device_data
        }

        const response = await axios.post("http://api.crypto3.exchange/Campaigns/device.php", data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        res.status(200).json({
            status: "success",
            message: "Verification request sent successfully",
            data: response.data
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            status: "failed",
            message: "Server Error"
        });
    }
})

export default taskRouter;