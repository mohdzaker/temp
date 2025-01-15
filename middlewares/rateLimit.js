import RateLimit from "../models/RateLimit.js";

const rateLimitMiddleware = async (req, res, next) => {
  try {
    const { mobile_number } = req.body;
    const now = new Date();

    const rateLimitRecord = await RateLimit.findOne({
      where: { mobileNumber: mobile_number },
    });

    if (rateLimitRecord) {
      const timeDifference = now - rateLimitRecord.timestamp;

      if (timeDifference < 3 * 60 * 1000) {
        return res.json({
          status: "failed",
          success: false,
          message: `OTP already sent! Please try again after ${Math.ceil(
            (3 * 60 * 1000 - timeDifference) / 1000
          )} seconds.`,
        });
      }

      await RateLimit.update(
        {
          requestCount: 1,
          timestamp: now,
        },
        { where: { mobileNumber: mobile_number } }
      );
    } else {
      await RateLimit.create({
        mobileNumber: mobile_number,
        requestCount: 1,
        timestamp: now,
      });
    }

    next();
  } catch (error) {
    console.error("Error in rate limiting middleware:", error);
    return res.status(500).json({
      status: "failed",
      success: false,
      message: "Internal server error!",
    });
  }
};

export default rateLimitMiddleware;
