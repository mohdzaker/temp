import axios from "axios";

export const setUserEmail = async (email) => {
  const ONESIGNAL_APP_ID = process.env.ONE_SIGNAL_APP_ID;
  const ONESIGNAL_API_KEY = process.env.ONE_SIGNAL_API_KEY;

  try {
    // Step 1: Check if the email is already registered in OneSignal
    const checkResponse = await axios.get(
      `https://api.onesignal.com/apps/${ONESIGNAL_APP_ID}/users/by/alias_label/external_id/${email}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${ONESIGNAL_API_KEY}`,
        },
      }
    );

    if (checkResponse.data && checkResponse.data.identity?.external_id) {
      return {
        status: "success",
        message: "✅ Email already registered in OneSignal!",
      };
    }
  } catch (checkError) {
    console.log("ℹ️ Email not found in OneSignal. Proceeding to set it...");
  }

  // Step 2: If email is not set, register it in OneSignal and add email subscription
  const userData = {
    properties: {
      language: "en",
      country: "US",
    },
    identity: { external_id: email },
  };

  try {
    // Creating the user
    const userResponse = await axios.post(
      `https://api.onesignal.com/apps/${ONESIGNAL_APP_ID}/users`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${ONESIGNAL_API_KEY}`,
        },
      }
    )
   

    return {
      status: "success",
      message: "✅ Email and subscription set in OneSignal successfully!",
      data: subscriptionResponse.data,
    };
  } catch (error) {
    console.error("❌ Error Setting Email:", error.response?.data || error);
    return {
      status: "error",
      message: "❌ Failed to set email and subscription in OneSignal!",
      error: error.response?.data || error,
    };
  }
};


export const subcribeEmail = async (email) => {
    const ONESIGNAL_APP_ID = process.env.ONE_SIGNAL_APP_ID;
    const ONESIGNAL_API_KEY = process.env.ONE_SIGNAL_API_KEY;
  
    try {
        const subscriptionData = {
            subscription: {
              type: "Email",
              token: email, // The email to subscribe
            },
          };
      
          const subscriptionResponse = await axios.post(
            `https://api.onesignal.com/apps/${ONESIGNAL_APP_ID}/users/by/external_id/${email}/subscriptions`,
            subscriptionData,
            {
              headers: {
                accept: "application/json",
                Authorization: `Basic ${ONESIGNAL_API_KEY}`,
                "content-type": "application/json",
              },
            }
          );

          return res.status(200).json({
            status: "success",
            message: "�� Email subscription set successfully!",
            data: subscriptionResponse.data,
          });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            status: "failed",
            message: "Failed to subscribe email",
        });
    }
}

// Send a notification to a specific user by email address	
export const sendNotificationByEmail = async (title, description, email) => {
    const ONESIGNAL_APP_ID = process.env.ONE_SIGNAL_APP_ID;
    const ONESIGNAL_API_KEY = process.env.ONE_SIGNAL_API_KEY;
  
    const notificationData = {
      app_id: ONESIGNAL_APP_ID,
      contents: { en: description }, // Notification body
      headings: { en: title }, // Notification title
      filters: [{ field: "email", value: email }], // Filter by email
    };
  
    try {
      const response = await axios.post(
        "https://api.onesignal.com/notifications?c=push",
        notificationData,
        {
          headers: {
            accept: "application/json",
            Authorization: `Basic ${ONESIGNAL_API_KEY}`, // Use Basic Key for authentication
            "content-type": "application/json",
          },
        }
      );
      console.log("✅ Notification Sent Successfully:", response.data);
    } catch (error) {
      console.error("❌ Error Sending Notification:", error.response?.data || error);
    }
  };