import { sendNotificationToUser } from "../../../utils/sendPushNotification.js";
import User from "../../../models/User.js";

const sendNotification = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: ['id'] });
        const { title, description } = req.body;
        if (!users.length) {
            return res.status(404).json({
                status: "failed",
                message: "No users found"
            });
        }

        await Promise.all(users.map(user => 
            sendNotificationToUser(title, description, user.id)
        ));

        return res.status(200).json({
            status: "success",
            message: "Notification sent to all users successfully"
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            status: "failed",
            message: "Failed to send notifications"
        });
    }
}

export default sendNotification;
