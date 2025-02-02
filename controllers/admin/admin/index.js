import Admin from "../../../models/Admin.js";

// Get Admins with Pagination
export const getAdmins = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const { rows, count } = await Admin.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["id", "DESC"]],
    });

    res.json({
      status: "success",
      data: rows,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      totalRecords: count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Failed to fetch admins",
    });
  }
};

export const removeAdmin = async (req, res) => {
  try {
    const { id } = req.body;

    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({
        status: "failed",
        message: "Admin not found",
      });
    }

    await admin.destroy();

    res.json({
      status: "success",
      message: "Admin removed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Failed to remove admin",
    });
  }
};
