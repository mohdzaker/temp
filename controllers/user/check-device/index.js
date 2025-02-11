import User from "../../../models/User.js";

const checkDevice = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { device_id } = req.body;

        if (!device_id) {
            return res.status(400).json({
                status: "failed",
                message: "Device ID is required",
            });
        }

        const user = await User.findOne({ where: { id: user_id } });

        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: "User not found",
            });
        }

        if (!user.device_id) {
            await User.update(
                { device_id: user.device_id || device_id },
                { where: { id: user_id } }
            );

            return res.status(200).json({
                status: "success",
                message: "Device details updated successfully",
            });
        }

        return res.status(400).json({
            status: "success",
            message: "Device ID is already set",
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
