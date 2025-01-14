import Otp from "../../models/Otp.js";
import { generateOTP, getExpirationDate } from "../../utils/index.js";
import sendCode from "../../utils/sendOtp.js"
import User from "../../models/User.js"

const sendOtpCode = async (req, res) => {
    try {
        const { mobile_number } = await req.body;
        
        if(!mobile_number || mobile_number == ""){
            return res.json({
                status: "failed",
                success: false,
                message: "Please enter a valid mobile number!"
            });
        }

        if(mobile_number.length < 10){
            return res.json({
                status: "failed",
                success: false,
                message: "Mobile number should be equal to 10 digits!"
            });
        }

        const checkAdminExists = await User.findOne({where:{
            mobileNumber: mobile_number,
            role: "admin"
        }});

        if(!checkAdminExists){
            return res.json({
                status: "failed",
                success: false,
                message: "Admin not found!"
            });
        }
        const otpCode = generateOTP();
        const expiresAt = getExpirationDate();

        try {
            const newOtpRow = await Otp.create({
                mobileNumber: mobile_number,
                otpCode,
                expiresAt
            });

            const sendOtp = await sendCode([mobile_number], otpCode);

            if(sendOtp.status == "success" && sendOtp.success){
                return res.json({
                    status: "success",
                    success: true,
                    message: sendOtp.message
                });
            }else{
                return res.json({
                    status: "failed",
                    success: false,
                    message: sendOtp.message
                })
            }
        } catch (error) {
            console.log(error);
            return res.json({
                status: "failed",
                success: false,
                message: "Something went wrong!"
            })
        }
    } catch (error) {
        console.log(error);
        res.json({
            status: false,
            message: "Something went wrong!"
        });
    }
}

export default sendOtpCode;