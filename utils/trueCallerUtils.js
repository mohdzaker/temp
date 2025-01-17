export const getPhoneNumberDetails = async (accessToken) => {
    try {
      const clientId = process.env.TRUECALLER_CLIENT_ID;
      const url = `https://sdk-otp-verification-noneu.truecaller.com/v1/otp/client/installation/phoneNumberDetail/${accessToken}`;
  
      const response = await axios.get(url, {
        headers: {
          clientId,
        },
      });
  
      return {
        status: "success",
        message: "Phone number details fetched successfully!",
        data: response.data,
      };
    } catch (error) {
      const errorResponse = error.response?.data || error.message;
      console.error("Error fetching phone number details:", errorResponse);
      return {
        status: "failed",
        message: errorResponse,
      };
    }
  }; 
  