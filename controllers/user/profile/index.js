import User from "../../../models/User.js";

const getUserProfile = async (req, res) => {
    try {
        const user_id = req.user.id;

        const userInfo = await User.findOne({
            where: {
                id: user_id
            }
        });

        return res.json({
            status: "success",
            message: "User profile fetched successfully!",
            data: userInfo
        });
    } catch (error) {
        console.log(error);
        return res.json({
            status: "failed",
            message: "Something went wrong!"
        })
    }
}

export default getUserProfile;