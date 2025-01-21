import Admin from "../../../../models/Admin.js";
import bcrypt from "bcryptjs";

const adminRegister = async (req, res) => {
    try {
        const { email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const checkAdminExists = await Admin.findOne({
            where: {
                email
            }
        });

        if(checkAdminExists){
            return res.status(409).json({
                status: "failed",
                message: "Admin with this email already exists!",
            });
        }

        const newAdmin = new Admin({
            email,
            password: hashedPassword,
        });

        await newAdmin.save();

        res.status(201).json({
            status: "success",
            message: "Admin registered successfully!",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "failed",
            message: "Internal server error!",
        });
    }
}

export default adminRegister;