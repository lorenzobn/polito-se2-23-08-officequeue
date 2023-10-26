const { Ticket, ServiceType, Counter, TicketStatus } = require("./models");

const addServiceType = async (req, res) => {
  try {
    const { tagName, averageServiceTime } = req.body;
    const serviceType = await ServiceType.create({
      tagName,
      averageServiceTime,
    });
    return res
      .status(201)
      .json({ msg: "ServiceType created.", data: serviceType });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "An unknown error occurred." });
  }
};
const getServiceTypes = async (req, res) => {
  try {
    const serviceTypes = await ServiceType.findAll();
    return res
      .status(201)
      .json({ msg: "ServiceTypes fetched.", data: serviceTypes });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "An unknown error occurred." });
  }
};
const addCounter = async (req, res) => {
  try {
    const counter = await Counter.create();
    const { serviceTypeTagNames } = req.body;
    if (!serviceTypeTagNames) {
      return res.status(400).json({ msg: "serviceTypeTagNames are required" });
    }
    serviceTypeTagNames.forEach(async (tagName) => {
      const serviceType = await ServiceType.findOne({
        where: { tagName: tagName },
      });
      counter.addServiceType(serviceType);
    });
    return res.status(201).json({ msg: "counter added", data: counter });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "An unknown error occurred." });
  }
};

const getCounters = async (req, res) => {
  try {
    const counters = await Counter.findAll();
    return res.status(201).json({ msg: "counters fetched", data: counters });
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
      status: TicketStatus.open,
    });
    return res.status(201).json({ msg: "ticket created.", data: ticket });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "An unknown error occurred." });
  }
};

const serveNextTicket = async (req, res) => {
  try {
    const { counterNumber } = req.body;
    const counter = await Counter.findByPk(counterNumber);
    if (!counter) {
      return res.status(400).json({ msg: "invalid counter number" });
    }
    const lastTicket = await Ticket.findByPk(counter.currentTicketId);
    if (!lastTicket) {
      return res.status(500).json({ msg: "internal server error" });
    }
    lastTicket.status = TicketStatus.done;
    await lastTicket.save();

    const serviceTypes = await counter.getServiceTypes();
    if (!serviceTypes) {
      return res.status(400).json({ msg: "counter serves no service type" });
    }
    const queues = await Promise.all(
      serviceTypes.map(async (serviceType) => {
        const queue = await Ticket.findAll({
          where: { ServiceTypeId: serviceType.id, status: TicketStatus.open },
        });
        return queue;
      })
    );
    // find longest to serve first
    const longestQueue = queues.reduce((acc, curr) => {
      return curr.length > acc.length ? curr : acc;
    }, []);

    const ticket = longestQueue[0];
    ticket.status = TicketStatus.processing;
    ticket.save();
    counter.currentTicketId = ticket.id;
    counter.save();

    return res
      .status(201)
      .json({ msg: "next ticket is being served.", data: ticket });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "An unknown error occurred." });
  }
};

const getCurrentTicket = async (req, res) => {
  try {
    const currentTickets = await Ticket.findAll({
      where: { status: TicketStatus.processing },
    });
    // find latest
    currentTickets.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    return res
      .status(200)
      .json({ msg: "current ticket fetched", data: currentTickets[0] });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "An unknown error occurred." });
  }
};
module.exports = {
  addTicket,
  addServiceType,
  addCounter,
  serveNextTicket,
  getCurrentTicket,
  getCounters,
  getServiceTypes,
};
