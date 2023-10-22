const express = require("express");
const { registerUser, getUsers, updateUser } = require("../users/handler");
const { homeHandler } = require("./handlers");
const { UserType, authorize } = require("./auth");

const registerRoutes = (app) => {
  // api health check
  app.get("/", (req, res) => {
    res.status(200).json({ msg: "health check passed! API is alive." });
  });

  // auth routes
  app.post("/api/v1.0/users/register", registerUser);
  app.get("/api/v1.0/users", authorize(UserType.manager), getUsers);
};

module.exports = registerRoutes;
