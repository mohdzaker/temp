import { sendNotification } from "../../../utils/sendPushNotification.js";

const sendNotification = async (req, res) => {
    try {
        const {user_id } = req.body;

        await sendNotification("Test", "This is a test notification", user_id);

        return res.status(200).json({
            status: "success",
            message: "Notification sent successfully"
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            status: "failed",
            message: "Failed to send notification"
        });
    }
}

export default sendNotification;