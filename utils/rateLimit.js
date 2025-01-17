import RateLimit from "../models/RateLimit.js";

const rateLimit = async (mobile_number) => {
  try {
    const now = new Date();

    const rateLimitRecord = await RateLimit.findOne({
      where: { mobileNumber: mobile_number },
    });

    if (rateLimitRecord) {
      const timeDifference = now - rateLimitRecord.timestamp;

      if (timeDifference < 3 * 60 * 1000) {
        return {
          status: "failed",
          success: false,
          message: `OTP already sent! Please try again after ${Math.ceil(
            (3 * 60 * 1000 - timeDifference) / 1000
          )} seconds.`,
        };
      }

      await RateLimit.update(
        {
          requestCount: 1,
          timestamp: now,
        },
        { where: { mobileNumber: mobile_number } }
      );
      return;
    } else {
      await RateLimit.create({
        mobileNumber: mobile_number,
        requestCount: 1,
        timestamp: now,
      });
    }
    return;
  } catch (error) {
    console.error("Error in rate limiting middleware:", error);
    return {
      status: "failed",
      success: false,
      message: "Internal server error!",
    };
  }
};

export default rateLimit;
