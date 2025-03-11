import User from "../../../models/User.js";
import PromoCode from "../../../models/PromoCode.js";
import Claim from "../../../models/Claim.js";
import sequelize from "../../../config/index.js"; 
import Transaction from "../../../models/Transaction.js";
import { sendNotificationToUser } from "../../../utils/sendPushNotification.js";

const claimPromoCode = async (req, res) => {
    const transaction = await sequelize.transaction(); 
    try {
        const user_id = req.user.id;
        const { promo_code } = req.body;

        const promo = await PromoCode.findOne({ where: { code: promo_code }, transaction });

        if (!promo) {
            return res.status(400).json({ status: "failed", message: "Invalid promo code" });
        }

        if (new Date() > promo.expires) {
            return res.status(400).json({ status: "failed", message: "Promo code has expired" });
        }

        const userClaims = await Claim.count({
            where: { user_id, promo_code_id: promo.id },
            transaction
        });

        if (userClaims >= 1) {
            return res.status(400).json({ status: "failed", message: "You have already claimed this promo code" });
        }

        if (promo.total_claimed >= promo.total_users) {
            return res.status(400).json({ status: "failed", message: "Promo code limit reached" });
        }

        await Transaction.create({
            user_id: user_id,
            amount: promo.per_user,
            description: "Claimed Promo Code",
            trans_type: "credit",
          });
          await sendNotificationToUser(
            "Claimed Succussfully🤑🥰",
            "You have claimed the promo code. Check the updated balance now!",
            referrer
          );
        await Claim.create({ user_id, promo_code_id: promo.id }, { transaction });

        await PromoCode.update(
            { total_claimed: promo.total_claimed + 1 },
            { where: { id: promo.id }, transaction }
        );

        await User.increment('balance', { 
            by: promo.per_user, 
            where: { id: user_id }, 
            transaction 
        });

        await transaction.commit();

        return res.status(200).json({ 
            status: "success", 
            message: `Promo code claimed successfully! Your balance increased by $${promo.per_user}.` 
        });

    } catch (error) {
        await transaction.rollback(); 
        console.log(error.message);
        res.status(500).json({
            status: "failed",
            message: "Server Error",
        });
    }
};

export default claimPromoCode;
