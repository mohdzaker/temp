import { Sequelize } from "sequelize";

let sequelize;

if(process.env.NODE_ENV !== 'production'){
    sequelize = new Sequelize( {
        dialect: "sqlite",
        storage: './database.sqlite',
    }, 
);
}else{
    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT
    });
}

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