import axios from "axios";

export const setUserEmail = async (email) => {
  const ONESIGNAL_APP_ID = process.env.ONE_SIGNAL_APP_ID;
  const ONESIGNAL_API_KEY = process.env.ONE_SIGNAL_API_KEY;

  try {
    // Step 1: Check if the email is already registered in OneSignal
    const checkResponse = await axios.get(
      `https://onesignal.com/api/v1/apps/${ONESIGNAL_APP_ID}/users/by_email/${email}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${ONESIGNAL_API_KEY}`,
        },
      }
    );

    if (checkResponse.data && checkResponse.data.id) {
        return {
            status: "success",
            message: "Email already registered in OneSignal!",
        }
    }
  } catch (checkError) {
    console.log("ℹ️ Email not found in OneSignal. Proceeding to set it...");
  }

  const userData = {
    app_id: ONESIGNAL_APP_ID,
    identity: { external_id: email },
    subscriptions: [{ type: "email", token: email }],
  };

  try {
    const response = await axios.post(
      `https://onesignal.com/api/v1/users/${ONESIGNAL_APP_ID}/identity`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ONESIGNAL_API_KEY}`,
        },
      }
    );
    return {
        status: "success",
        message: "Email set in OneSignal successfully!",
    }
  } catch (error) {
    console.error("❌ Error Setting Email:", error.response?.data || error);
  }
};


// Send a notification to a specific user by email address	
export const sendNotificationByEmail = async (title, description, email) => {
  const ONESIGNAL_APP_ID = process.env.ONE_SIGNAL_APP_ID;
  const ONESIGNAL_API_KEY = process.env.ONE_SIGNAL_API_KEY;

  const notificationData = {
    app_id: ONESIGNAL_APP_ID,
    filters: [{ field: "email", value: email }], 
    headings: { en: title },
    contents: { en: description },
  };

  try {
    const response = await axios.post(
      "https://onesignal.com/api/v1/notifications",
      notificationData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${ONESIGNAL_API_KEY}`,
        },
      }
    );
    console.log("✅ Notification Sent Successfully:", response.data);
  } catch (error) {
    console.error(
      "❌ Error Sending Notification:",
      error.response?.data || error
    );
  }
};

// Example Usage
sendNotificationByEmail(
  "🚀 Special Alert!",
  "You have a new message!",
  "user@example.com"
);
