const express = require("express");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const crypto = require("crypto");
const { addAuthHandlers, generateLocalPassport } = require("./auth");
const { runMigrations } = require("./models");
const registerRoutes = require("./routes");
require("dotenv").config();

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// CORS options to access APIs
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

// migrate db mdoels
runMigrations();
const randomSecret = crypto.randomBytes(64).toString("hex");

app.use(
  session({
    secret: randomSecret,
    resave: false,
    saveUninitialized: false,
  })
);
const passport = generateLocalPassport();

// Initialize Passport and restore authentication state if available
app.use(passport.initialize());
app.use(passport.session());

addAuthHandlers(app);

registerRoutes(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
