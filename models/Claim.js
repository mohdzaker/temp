import PromoCode from "../../../models/PromoCode.js";
import { Sequelize } from "sequelize";
import sequelize from "../config/index.js";

const Claim = sequelize.define('Claim', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    promo_code_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'PromoCodes',
            key: 'id'
        }
    },
    claimed_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
});

export default Claim;