import Config from "../../../models/Config.js";

const setConfig = async (req, res) => {
  try {
    const { invite_rules, withdraw_rules, per_refer, minimum_withdraw, invite_link_template } =
      req.body;

      if(!invite_rules){
        return res.status(400).json({
          status: "failed",
          success: false,
          message: "Please provide invite rules!",
        });
      }
      
      if(!withdraw_rules){
        return res.status(400).json({
          status: "failed",
          success: false,
          message: "Please provide withdraw rules!",
        });
      }
      
      if(!per_refer){
        return res.status(400).json({
          status: "failed",
          success: false,
          message: "Please provide per refer amount!",
        });
      }
      
      if(!minimum_withdraw){
        return res.status(400).json({
          status: "failed",
          success: false,
          message: "Please provide minimum withdraw amount!",
        });
      }

      if(!invite_link_template){
        return res.status(400).json({
          status: "failed",
          message: "Please provide invite link template!",
        });
      }
      const isRowExist = await Config.findOne({
        where: { id: 1 },
      });

      if (isRowExist) {
        await Config.update(
          {
            invite_rules,
            withdraw_rules,
            per_refer,
            minimum_withdraw,
            invite_link_template
          },
          { where: { id: 1 } }
        );
      } else {
        await Config.create({
          invite_rules,
          withdraw_rules,
          per_refer,
          minimum_withdraw,
          invite_link_template,
        });
      }

      return res.status(200).json({
        status: "success",
        success: true,
        message: "Config updated successfully!",
      });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "failed",
      success: false,
      message: "Internal Server Error",
    });
  }
};

export default setConfig;