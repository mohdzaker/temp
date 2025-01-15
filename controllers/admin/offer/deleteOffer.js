import Offer from "../../../models/Offer.js";

const deleteOffer = async (req, res) => {
    try {
        const { id } = req.body;

        const offer = await Offer.findByPk(id);

        if (!offer) {
            return res.json({
                status: "failed",
                success: false,
                message: "Offer not found!"
            });
        }

        await offer.destroy();

        return res.json({
            status: "success",
            success: true,
            message: "Offer deleted successfully!"
        });
    } catch (error) {
        console.error(error);
        return res.json({
            status: "failed",
            success: false,
            message: "An error occurred while deleting the offer!"
        });
    }
};

export default deleteOffer;
