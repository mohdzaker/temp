import { sendNotificationByEmail, setUserEmail, subcribeEmail } from "../../../utils/sendPushNotification.js";

const sendNotification = async (req, res) => {
    try {
        const { email } = req.body;

        const setEmail = await setUserEmail(email);
        if(setEmail.status === 'success'){
            await subcribeEmail(email)
            const sendNoti = await sendNotificationByEmail("Test", "This is a test notification!", email);
            return res.status(200).json({
                status: "success",
                message: "Notification sent successfully"
            });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            status: "failed",
            message: "Failed to send notification"
        });
    }
}

export default sendNotification;