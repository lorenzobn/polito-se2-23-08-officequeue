const passport = require("passport");
const LocalSequelizeStrategy = require("passport-local").Strategy;
const { User } = require("./models");
const bcrypt = require("bcrypt");

const UserType = {
  inactive: 1,
  notVerified: 2,
  customer: 3,
  manager: 4,
  root: 5,
};

const generateLocalPassport = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  const localStrategy = new LocalSequelizeStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ where: { email } });
        if (!user || !(await comparePasswords(password, user))) {
          return done(null, false, { msg: "Incorrect email or password." });
        }
        user.password = undefined;
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  );

  passport.use(localStrategy);
  return passport;
};

const addAuthHandlers = (app) => {
  app.post("/api/v1.0/login", passport.authenticate("local"), (req, res) => {
    return res.status(200).json({
      msg: "logged in successfully",
      data: req.user,
    });
  });

  app.post("/api/v1.0/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ msg: err.message });
      }
      return res.status(200).json({ msg: "Logged out successfully." });
    });
  });
};

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized access." });
};

const authorize = (type) => {
  return (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.type >= type) {
        return next();
      }
    }
    return res.status(401).json({ error: "Unauthorized access." });
  };
};

const comparePasswords = async (inputPassword, user) => {
  try {
    const isMatch = await bcrypt.compare(inputPassword, user.password);
    return isMatch;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
};

module.exports = {
  UserType,
  generateLocalPassport,
  addAuthHandlers,
  isAuthenticated,
  authorize,
  comparePasswords,
};
