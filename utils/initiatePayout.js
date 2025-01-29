import axios from "axios";

export async function initiatePayout(name, upi, amount, comment, orderId) {
    const url = "https://payout.pe2pe.in/Pe2Pe/v2/";
    
    // Construct query parameters
    const params = new URLSearchParams({
        secret_key: "Oh5t9F3HuDK4rEzS",
        api_id: "Agh1I5f4xuratLrE",
        name: name,
        upi: upi,
        amount: amount,
        comment: comment,
        order_id: orderId,
    }).toString();

    try {
        const response = await axios.get(`${url}?${params}`);
        console.log("Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        throw error;
    }
}

export function generateOrderId(prefix = "HUNTORD") {
    const timestamp = Date.now(); // Current timestamp in milliseconds
    const randomNum = Math.floor(Math.random() * 100000); // Random number (0-99999)
    return `${prefix}${timestamp}${randomNum}`;
}

