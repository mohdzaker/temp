import Config from "../../../models/Config.js";

const getConfig = async (req, res) => {
    try {
        const configs = await Config.findAll();
        return res.json({
            status: "success",
            message: "Configuration fetched successfully",
            data: configs,
        });
    } catch (error) {
        console.error("Error fetching configuration:", error);
        return res.json({
            status: "failed",
            message: "Failed to get configuration",
        });
    }
};

export default getConfig;
