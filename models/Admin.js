import { Sequelize } from "sequelize";
import sequelize from "../config/index.js";

const Admin = sequelize.define("Admin", {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});

export default Admin;