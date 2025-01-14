import jwt from "jsonwebtoken";

const authAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if(!token){
        return res.json({
            status: "failed",
            success: false,
            message: "Token not found!"
        });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded.role === "user"){
            return res.json({
                status: "failed",
                success: false,
                message: "Not authorized!"
            });
        }
        req.admin = decoded;
        next();
    } catch (error) {
        console.log(error);
        return res.json({
            status: "failed",
            success: false,
            message: "Invalid token!"
        });
    }
}

export default authAdmin;