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

  // Step 2: If email is not set, register it in OneSignal
  const userData = {
    properties: {
      language: "en",
      country: "US",
    },
    identity: { external_id: email },
    subscriptions: [{ type: "email", token: email }],
  };

  try {
    const response = await axios.post(
      `https://api.onesignal.com/apps/${ONESIGNAL_APP_ID}/users`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${ONESIGNAL_API_KEY}`,
        },
      }
    );

    return {
      status: "success",
      message: "✅ Email set in OneSignal successfully!",
      data: response.data,
    };
  } catch (error) {
    console.error("❌ Error Setting Email:", error.response?.data || error);
    return {
      status: "error",
      message: "❌ Failed to set email in OneSignal!",
      error: error.response?.data || error,
    };
  }
};


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