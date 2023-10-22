const Sequelize = require("sequelize");
const database = process.env.DB_NAME;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;

const db = new Sequelize(database, username, password, {
  host: host,
  dialect: "sqlite",
  storage: "./database.sqlite",
});

const ServiceType = sequelize.define("ServiceType", {
  tagName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  averageServiceTime: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

const Counter = sequelize.define("Counter", {
  counterNumber: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

const Ticket = sequelize.define("Ticket", {
  ticketCode: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  customerId: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
});

const Queue = sequelize.define("Queue", {});

const Notification = sequelize.define("Notification", {
  message: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const User = sequelize.define("User", {
  type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = {
  ServiceType,
  Counter,
  Ticket,
  Queue,
  Notification,
  TicketCall,
  Estimate,
  User,
  sequelize,
};

ServiceType.hasMany(Queue);
Queue.belongsTo(ServiceType);

ServiceType.belongsToMany(Counter, { through: "ServiceTypeCounter" });
Counter.belongsToMany(ServiceType, { through: "ServiceTypeCounter" });

Queue.hasMany(Ticket);
Ticket.belongsTo(Queue);
Ticket.belongsTo(User, { foreignKey: "customerId" });

Counter.hasMany(TicketCall);
TicketCall.belongsTo(Counter);

Ticket.hasOne(TicketCall);
TicketCall.belongsTo(Ticket);

Ticket.hasOne(Estimate);
Estimate.belongsTo(Ticket);

const runMigrations = async () => {
  try {
    // Run all pending migrations
    await db.authenticate();
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await sequelize.sync({ force: false });
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Error syncing database:", error);
    process.exit(1);
  }
};
module.exports = {
  ServiceType,
  Counter,
  Ticket,
  Queue,
  Notification,
  User,
  db,
  runMigrations,
};
