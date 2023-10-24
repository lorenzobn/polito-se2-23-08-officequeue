const { registerUser, getUsers } = require("./users");
const { UserType, authorize } = require("./auth");
const { addTicket, addServiceType } = require("./tickets");
const registerRoutes = (app) => {
  // api health check
  app.get("/", (req, res) => {
    res.status(200).json({ msg: "health check passed! API is alive." });
  });

  // auth routes
  app.post("/api/v1.0/users/register", registerUser);
  app.get("/api/v1.0/users", authorize(UserType.manager), getUsers);

  // ticket routes
  app.post("/api/v1.0/tickets", addTicket);

  // serviceType routes
  app.post("/api/v1.0/service-types", addServiceType);
};

module.exports = registerRoutes;
