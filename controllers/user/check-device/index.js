import User from "../../../models/User.js";

const checkDevice = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { imei, device_id } = req.body;

        if (!imei || !device_id) {
            return res.status(400).json({
                status: "failed",
                message: "IMEI and device ID are required",
            });
        }

        const user = await User.findOne({ where: { id: user_id } });

        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: "User not found",
            });
        }

        if (!user.imei || !user.device_id) {
            await User.update(
                { imei: user.imei || imei, device_id: user.device_id || device_id },
                { where: { id: user_id } }
            );

            return res.status(200).json({
                status: "success",
                message: "Device details updated successfully",
            });
        }

        return res.status(400).json({
            status: "failed",
            message: "IMEI and device ID are already set",
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            status: "failed",
            message: "Internal server error",
        });
    }
};

export default checkDevice;
