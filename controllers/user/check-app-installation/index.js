import Offer from "../../../models/Offer.js";
import Click from "../../../models/Click.js";

const checkAppInstallation = async (req, res) => {
    try {
        const { id } = req.user;
        const { pkg_name } = req.body;

        if (!pkg_name) {
            return res.status(400).json({
                status: "failed",
                message: "Package name is required",
            });
        }

        const offer = await Offer.findOne({ where: { pkg_name } });

        if (!offer) {
            return res.status(404).json({
                status: "success",
                code: 1,
                message: "Package not set for this offer!",
            });
        }

        const click = await Click.findOne({ where: { user_id: id, pkg_name } });

        if (!click) {
            return res.status(404).json({
                status: "success",
                code: 2,
                message: "User has not clicked on this offer yet!",
            });
        }

        await Click.update(
            { is_user_app_installed: true }, 
            { where: { user_id: id, pkg_name } } 
        );

        return res.status(200).json({
            status: "success",
            code: 0,
            message: "User has installed the app!",
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            status: "error",
            message: "An error occurred while checking app installation status",
        });
    }
};

export default checkAppInstallation;
