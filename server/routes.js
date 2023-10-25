const { registerUser, getUsers } = require("./users");
const { UserType, authorize } = require("./auth");
const {
  addTicket,
  addServiceType,
  addCounter,
  serveNextTicket,
  getCurrentTicket,
} = require("./tickets");
const registerRoutes = (app) => {
  // api health check
  app.get("/", (req, res) => {
    res.status(200).json({ msg: "health check passed! API is alive." });
  });

  // auth routes
  app.post("/api/v1.0/users/register", registerUser);
  // !! UserType.manager ? !!
  app.get("/api/v1.0/users", authorize(UserType.manager), getUsers);

  // ticket routes
  app.post("/api/v1.0/tickets", addTicket);
  app.post("/api/v1.0/tickets/serve-next", serveNextTicket);
  app.get("/api/v1.0/tickets/current", getCurrentTicket);

  // serviceType routes
  app.post("/api/v1.0/service-types", addServiceType);

  // counter routes
  app.post("/api/v1.0/counters", addCounter);
};

module.exports = registerRoutes;
