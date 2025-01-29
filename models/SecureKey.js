import sequelize from "../config/index.js";
import { Sequelize } from "sequelize";

const SecretKey = sequelize.define("SecretKey",{
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    secret_key: Sequelize.STRING,
    timestamp: Sequelize.DATE
 });

 export default SecretKey;