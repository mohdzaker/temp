import axios from "axios";

export async function sendPayout(name, upi, amount, comment, orderId) {
    const url = "https://payout.pe2pe.in/Pe2Pe/v2/";
    const data = {
        secret_key: "Oh5t9F3HuDK4rEzS",
        api_id: "Agh1I5f4xuratLrE",
        name: name,
        upi: upi,
        amount: amount,
        comment: comment,
        order_id: orderId,
    };

    try {
        const response = await axios.post(url, data);
        console.log("Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        throw error;
    }
}
export function generateOrderId(prefix = "ORD") {
    const timestamp = Date.now(); // Current timestamp in milliseconds
    const randomNum = Math.floor(Math.random() * 100000); // Random number (0-99999)
    return `${prefix}${timestamp}${randomNum}`;
}

