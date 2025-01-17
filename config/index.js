import { Sequelize } from "sequelize";

const sequelize = new Sequelize( {
        dialect: "sqlite",
        storage: './database.sqlite',
    }
);

export const connectToDb = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        // await sequelize.sync({force: true});
        console.log("Connection has been established successfully!");
    } catch (error) {
        console.log(error)
    }
}

export default sequelize;