import Admin from "../../../../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || email.trim() === "") {
      return res.status(400).json({
        status: "failed",
        message: "Please provide email!",
      });
    }

    if (!password || password.trim() === "") {
      return res.status(400).json({
        status: "failed",
        message: "Please provide password!",
      });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({
        status: "failed",
        message: "Admin not found!",
      });
    }
    const checkPass = await bcrypt.compare(password, admin.password);
    if (!checkPass) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid password!",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: admin.id,role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      status: "success",
      message: "Admin logged in successfully!",
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "failed",
      message: "Internal server error!",
    });
  }
};

export default adminLogin;