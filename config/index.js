import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    'huntcash',
    'root',
    'Zaker786#$%', {
        host: "localhost",
        dialect: "mysql"
    }
);

export const connectToDb = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully!");
    } catch (error) {
        console.log(error)
    }
}

export default sequelize;