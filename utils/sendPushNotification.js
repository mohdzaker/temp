import axios from "axios";

export const sendNotification = async (title, description, externalId) => {
  const url = 'https://api.onesignal.com/notifications?c=push';
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      Authorization: `Key ${process.env.ONE_SIGNAL_APP_ID}`,
      'content-type': 'application/json'
    },
    data: {
      app_id: 'YOUR_APP_ID',
      data: { foo: 'bar' },
      headings: { en: title },
      contents: { en: description },
      include_external_user_ids: [externalId],
      channel_for_external_user_ids: 'push'
    }
  };

  try {
    const response = await axios(url, options);
    console.log('Notification Sent:', response.data);
  } catch (error) {
    console.error('Error sending notification:', error.response ? error.response.data : error.message);
  }
};
