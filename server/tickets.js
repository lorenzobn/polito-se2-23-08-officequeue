const { Ticket, ServiceType } = require("./models");

const addServiceType = async (req, res) => {
  try {
    const { tagName, averageServiceTime } = req.body;
    const serviceType = await ServiceType.create({
      tagName,
      averageServiceTime,
    });
    return res.status(201).json({ msg: "ServiceType created.", serviceType });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "An unknown error occurred." });
  }
};

const addTicket = async (req, res) => {
  try {
    const { serviceTypeTagName } = req.body;
    const serviceType = await ServiceType.findOne({
      where: { tagName: serviceTypeTagName },
    });
    if (!serviceType) {
      return res.status(400).json({ msg: "invalid serviceTypeTagName" });
    }
    const ticket = await Ticket.create({
      ServiceTypeId: serviceType.id,
    });
    return res.status(201).json({ msg: "ticket created.", ticket });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "An unknown error occurred." });
  }
};

module.exports = { addTicket, addServiceType };
