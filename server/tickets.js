const { User, Queue, Ticket, ServiceType } = require("./models");

const addTicket = async (req, res) => {
  try {
    const { serviceType } = req.body;
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "An unknown error occurred." });
  }
};

const getQueueForServiceType = (serviceTypeTag) => {
    
};
