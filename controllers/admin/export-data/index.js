import fs from "fs";
import { format } from "date-fns";
import fastCsv from "fast-csv"; // ✅ Correct Import
import { Op } from "sequelize";
import EventHistory from "../../../models/EventHistory.js";
import Event from "../../../models/Event.js";

const exportEvent = async (req, res) => {
  try {
    // Fetch event histories from Feb 6, 2025, onwards
    const histories = await EventHistory.findAll({
      where: {
        status: "completed",
        createdAt: { [Op.gte]: new Date("2025-02-06") },
      },
      raw: true,
    });

    // Fetch corresponding events and filter where event_amount > 0
    const results = await Promise.all(
      histories.map(async (history) => {
        const event = await Event.findOne({
          where: { id: history.event_id, event_amount: { [Op.gt]: 0 } },
          raw: true,
        });

        if (event) {
          return {
            event_history_id: history.id,
            event_id: history.event_id,
            createdAt: format(history.createdAt, "yyyy-MM-dd HH:mm:ss"),
            event_amount: event.event_amount,
          };
        }
      })
    );

    // Remove undefined values (if an event doesn't meet the condition)
    const filteredResults = results.filter(Boolean);

    // If no valid results, return a message
    if (filteredResults.length === 0) {
      return res.status(404).json({ message: "No events found with amount > 0" });
    }

    // Generate CSV file
    const writableStream = fs.createWriteStream("event_data.csv");
    const csvStream = fastCsv.format({ headers: true }); // ✅ Correct Usage

    csvStream.pipe(writableStream);
    filteredResults.forEach((row) => csvStream.write(row));
    csvStream.end();

    writableStream.on("finish", () => {
      res.download("event_data.csv", "event_data.csv");
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default exportEvent;
