import User from "../../../models/User.js";
import PromoCode from "../../../models/PromoCode.js";
import Claim from "../../../models/Claim.js";
import Transaction from "../../../models/Transaction.js";
import { sendNotificationToUser } from "../../../utils/sendPushNotification.js";

const claimPromoCode = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { promo_code } = req.body;

        // Check if promo code exists
        const promo = await PromoCode.findOne({ where: { code: promo_code } });
        if (!promo) {
            return res.status(400).json({ status: "failed", message: "Invalid promo code" });
        }

        // Check if the promo code has expired
        if (new Date() > promo.expires) {
            return res.status(400).json({ status: "failed", message: "Promo code has expired" });
        }

        // Check if the user has already claimed the promo
        const userClaims = await Claim.count({ where: { user_id, promo_code_id: promo.id } });
        if (userClaims >= 1) {
            return res.status(400).json({ status: "failed", message: "You have already claimed this promo code" });
        }

        // Check if the promo code claim limit is reached
        if (promo.total_claimed >= promo.total_users) {
            return res.status(400).json({ status: "failed", message: "Promo code limit reached" });
        }

        // 1. Create a new transaction record for the user
        const newTransaction = await Transaction.create({
            user_id: user_id,
            amount: promo.per_user,
            description: "Claimed Promo Code",
            trans_type: "credit",
        });

        if (!newTransaction) {
            return res.status(500).json({ status: "failed", message: "Failed to create transaction record." });
        }

        // 2. Send notification to the user
        await sendNotificationToUser(
            "Claimed Successfully 🤑🥰",
            "You have claimed the promo code. Check the updated balance now!",
            user_id
        );

        // 3. Create a claim record
        const claim = await Claim.create({ user_id, promo_code_id: promo.id });
        if (!claim) {
            return res.status(500).json({ status: "failed", message: "Failed to claim promo code." });
        }

        // 4. Update total_claimed count in PromoCode
        const updatedPromo = await PromoCode.update(
            { total_claimed: promo.total_claimed + 1 },
            { where: { id: promo.id } }
        );
        if (!updatedPromo) {
            return res.status(500).json({ status: "failed", message: "Failed to update promo code claim count." });
        }

        // 5. Increase user balance
        const updatedUser = await User.increment('balance', {
            by: promo.per_user,
            where: { id: user_id }
        });
        if (!updatedUser) {
            return res.status(500).json({ status: "failed", message: "Failed to update user balance." });
        }

        return res.status(200).json({
            status: "success",
            message: `Promo code claimed successfully! Your balance increased by $${promo.per_user}.`,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "failed",
            message: "Server Error",
        });
    }
};

export default claimPromoCode;
