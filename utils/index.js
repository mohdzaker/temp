export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
};

export const getExpirationDate = () => {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000);
    return expiresAt;
  };