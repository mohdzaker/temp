import Offer from "../../../models/Offer.js";

const editOffer = async (req, res) => {
    try {
        const { id } = req.params;

        if(!id){
            return res.json({
                status: "failed",
                success: false,
                message: "Please pass a id in url query!"
            });
        }
        const { 
            campaign_name, 
            short_description, 
            tracking_link, 
            campaign_logo, 
            status, 
        } = req.body;

        if(!campaign_name || campaign_name == ""){
            return res.json({
                status: "failed",
                success: false,
                message: "Please provide a campaign name!"
            });
        }

        if(!short_description || short_description == ""){
            return res.json({
                status: "failed",
                success: false,
                message: "Please provide a short description!"
            });
        }

        if(!tracking_link || tracking_link == ""){
            return res.json({
                status: "failed",
                success: false,
                message: "Please provide a tracking link!"
            });
        }

        if(!campaign_logo || campaign_logo == ""){
            return res.json({
                status: "failed",
                success: false,
                message: "Please provide a campaign logo!"
            });
        }

        if(!status || status == ""){
            return res.json({
                status: "failed",
                success: false,
                message: "Please provide a campaign status!"
            });
        }

        const offer = await Offer.findByPk(id);

        if (!offer) {
            return res.json({
                status: "failed",
                success: false,
                message: "Offer not found!"
            });
        }

        const updatedOffer = await offer.update({
            campaign_name: campaign_name || offer.campaign_name,
            short_description: short_description || offer.short_description,
            tracking_link: tracking_link || offer.tracking_link,
            campaign_logo: campaign_logo || offer.campaign_logo,
            status: status || offer.status,
        });

        return res.json({
            status: "success",
            success: true,
            message: "Offer updated successfully!",
        });
    } catch (error) {
        console.error(error);
        return res.json({
            status: "failed",
            success: false,
            message: "An error occurred while updating the offer!"
        });
    }
};

export default editOffer;
