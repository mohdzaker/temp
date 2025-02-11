import PromoCode from "../../../models/PromoCode.js";

const generatePromoCode = () => {
    return Math.random().toString(36).substr(2, 10).toUpperCase();
};

const createPromoCode = async (req, res) => {
    try {
        const { per_user, total_users, expires } = req.body;
        const promoCode = generatePromoCode();
        
        const newPromo = await PromoCode.create({
            per_user,
            total_users,
            total_claimed: 0,
            expires,
            code: promoCode,
        });

        return res.status(201).json({
            status: "success",
            message: "Promo code created successfully!",
            data: newPromo,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            status: "failed",
            message: "Internal Server Error!",
        });
    }
};

const getAllPromoCodes = async (req, res) => {
    try {
        const promoCodes = await PromoCode.findAll();
        return res.status(200).json({ status: "success", data: promoCodes });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ status: "failed", message: "Internal Server Error!" });
    }
};

const getPromoCodeById = async (req, res) => {
    try {
        const { id } = req.query;
        const promoCode = await PromoCode.findByPk(id);
        if (!promoCode) {
            return res.status(404).json({ status: "failed", message: "Promo code not found!" });
        }
        return res.status(200).json({ status: "success", data: promoCode });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ status: "failed", message: "Internal Server Error!" });
    }
};

const updatePromoCode = async (req, res) => {
    try {
        const { id } = req.query;
        const { per_user, total_users, expires } = req.body;
        
        const promoCode = await PromoCode.findByPk(id);
        if (!promoCode) {
            return res.status(404).json({ status: "failed", message: "Promo code not found!" });
        }
        
        await promoCode.update({ per_user, total_users, expires });
        return res.status(200).json({ status: "success", message: "Promo code updated successfully!", data: promoCode });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ status: "failed", message: "Internal Server Error!" });
    }
};

const deletePromoCode = async (req, res) => {
    try {
        const { id } = req.query;
        const promoCode = await PromoCode.findByPk(id);
        if (!promoCode) {
            return res.status(404).json({ status: "failed", message: "Promo code not found!" });
        }
        
        await promoCode.destroy();
        return res.status(200).json({ status: "success", message: "Promo code deleted successfully!" });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ status: "failed", message: "Internal Server Error!" });
    }
};

export { createPromoCode, getAllPromoCodes, getPromoCodeById, updatePromoCode, deletePromoCode };
