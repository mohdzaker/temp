import Otp from "../../models/Otp.js";
import User from "../../models/User.js";
import verifyOtp from "../../utils/verifyOtp.js";
import jwt from "jsonwebtoken";

const verifyOtpCode = async (req, res) => {
    try {
        const { mobile_number, otp_code } = await req.body;

        const verifyCode = await verifyOtp(mobile_number,otp_code);

        if(verifyCode.status == "failed" && !verifyCode.success){
            return res.json({
                status: "failed",
                success: false,
                message: verifyCode.message
            });
        }

        const checkExistingUser = await User.findOne({where: {
            mobileNumber: mobile_number
        }});

        if(!checkExistingUser){
            const newUser = await User.create({
                mobileNumber: mobile_number,
            });
        }
        const token = jwt.sign({
            mobile_number,
        }, process.env.JWT_SECRET);

        res.json({
            status: "success",
            success: true,
            message: "Verification successful!",
            token
        })
    } catch (error) {
        console.log(error);
        res.json({
            status: false,
            message: "Something went wrong!"
        });
    }
}

export default verifyOtpCode;