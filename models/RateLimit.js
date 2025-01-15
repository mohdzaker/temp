import { Sequelize } from "sequelize";
import sequelize from "../config/index.js";

const RateLimit = sequelize.define("RateLimit", {
    mobileNumber: Sequelize.STRING,
    requestCount: Sequelize.INTEGER,
    timestamp: Sequelize.DATE
});

export default RateLimit;