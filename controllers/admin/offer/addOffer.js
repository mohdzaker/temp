import Offer from "../../../models/Offer.js";

const addOffer = async (req, res) => {
    try {
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

        const newOffer = await Offer.create({
            campaign_name,
            short_description,
            tracking_link,
            campaign_logo,
            status,
        });

        return res.json({
            status: "success",
            success: true,
            message: "Offer added successfully!",
        });
    } catch (error) {
        console.error(error);
        return res.json({
            status: "failed",
            success: false,
            message: "An error occurred while adding the offer!"
        });
    }
}

export default addOffer;