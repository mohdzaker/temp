import { Sequelize } from "sequelize";
import User from "../../../models/User.js";

const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json({
            status: "success",
            message: "Users fetched successfully",
            data: users,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            status: "failed",
            message: "Internal Server Error",
        });
    }
};

export default getUsers;


export const updateUserBanStatus = async (req, res) => {
    try {
        const { id, isBanned } = req.body;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: "User not found",
            });
        }

        user.isBanned = isBanned;
        await user.save();

        res.status(200).json({
            status: "success",
            message: `User has been ${isBanned ? "banned" : "unbanned"} successfully`,
        });
    } catch (error) {
        console.error("Error updating user ban status:", error);
        res.status(500).json({
            status: "failed",
            message: "Internal Server Error",
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.query; 
        const user = await User.findByPk(id); 
        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: "User not found",
            });
        }

        res.status(200).json({
            status: "success",
            message: "User fetched successfully",
            data: user,
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({
            status: "failed",
            message: "Internal Server Error",
        });
    }
};


export const getUsersGroupedByDate = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query; 
      const offset = (page - 1) * limit;
  
      const users = await User.findAll({
        attributes: [
          [Sequelize.fn("DATE", Sequelize.col("createdAt")), "registration_date"], 
          [Sequelize.fn("COUNT", Sequelize.col("id")), "user_count"],
        ],
        include: [
          {
            model: User,
            attributes: ["id", "username", "email", "profilePic"], 
          },
        ],
        group: [Sequelize.fn("DATE", Sequelize.col("createdAt"))],
        order: [[Sequelize.fn("DATE", Sequelize.col("createdAt")), "DESC"]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });
  
      const totalRecords = await User.count({
        distinct: true,
        col: "createdAt",
      });
  
      res.json({
        status: "success",
        data: users,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords: totalRecords,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({
        status: "failed",
        message: "Failed to fetch users",
      });
    }
  };