import SecretKey from "../../../models/SecureKey.js";

export const setSecretKey = async (req, res) => {
    try {
        const { secret_key } = req.body;

        if (!secret_key) {
            return res.status(400).json({
                status: "failed",
                message: "Secret key is required",
            });
        }

        const existingKey = await SecretKey.findOne({
            where: { id: 1 },
        });

        if (existingKey) {
            await existingKey.update({ secret_key, timestamp: new Date() });
        } else {
            await SecretKey.create({
                secret_key,
                timestamp: new Date(),
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Secret key set successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "failed",
            message: "Failed to set secret key",
        });
    }
};
