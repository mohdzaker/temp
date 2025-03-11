import axios from "axios";

export async function initiatePayout(name, upi, amount, comment, orderId) {
    const url = `https://open.rewardrush.in/Gateway/sendPayout.php?platform=huntcash&secret=uS1r7hbbY6&upi_id=${upi}&amount=${amount}&order_id=${orderId}`;

    try {
        const response = await axios.get(url);
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

