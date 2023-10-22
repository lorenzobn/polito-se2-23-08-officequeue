const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const crypto = require("crypto");
const { addAuthHandlers } = require("./auth");
const { runMigrations } = require("./models");
const registerRoutes = require("./routes");
require("dotenv").config();

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// migrate db mdoels
runMigrations();
const randomSecret = crypto.randomBytes(64).toString("hex");

app.use(
  session({
    secret: randomSecret, // Replace this with a secure random string
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport and restore authentication state if available
app.use(passport.initialize());
app.use(passport.session());

addAuthHandlers(app);

registerRoutes(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
