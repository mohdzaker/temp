import Withdraw from "../../../models/Withdraw.js";

const callback = async (req, res) => {
  try {
    const { data } = req.body;
    if (!data || !data.upi || !data.tnx_id || !data.order_id || !data.status) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    if (data.status == "success") {
      const withdraw = await Withdraw.findOneAndUpdate(
        {
          tnx_id: data.tnx_id,
          order_id: data.order_id,
        },
        {
          $set: {
            withdraw_status: 0,
            status: data.status,
          },
        },
        { new: true }
      );
    } else {
      const withdraw = await Withdraw.findOneAndUpdate(
        {
          tnx_id: data.tnx_id,
          order_id: data.order_id,
        },
        {
          $set: {
            withdraw_status: 1,
            status: data.status,
          },
        },
        { new: true }
      );
    }

    return res.json({
      status: "success",
      message: "Payment callback processed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      message: "Error processing payment callback",
    });
  }
};

export default callback;