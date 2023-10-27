const bcrypt = require("bcrypt");
const { UserType } = require("./auth");
const { User } = require("./models");
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10); 
    const newUser = await User.create({
      firstName,
      lastName,
      phone,
      email,

      password: hashedPassword,
      type: UserType.notVerified,
    });
    await newUser.save();
    res.status(201).json({ msg: "user created", data: newUser });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { error } = updateUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const { id } = req.params;
    const { name, email, password, type } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (name !== undefined) {
      user.name = name;
    }
    if (email !== undefined) {
      user.email = email;
    }
    if (password !== undefined) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    if (type !== undefined) {
      user.type = type;
    }
    await user.save();
    res.status(200).json({ msg: "user updated", data: user });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "An unknown error occurred." });
  }
};

const getUsers = async (req, res) => {
  try {
    let users = await User.findAll();
    const usersWithoutPasswords = users.map((user) => {
      const { id, name, email, type, createdAt, updatedAt } = user;
      // !! createdAt, updatedAt ? !!
      return { id, name, email, type, createdAt, updatedAt };
    });
    res
      .status(200)
      .json({ msg: "users fetched successfully", data: usersWithoutPasswords });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "An unknown error occurred." });
  }
};

module.exports = {
  getUsers,
  registerUser,
  updateUser,
};
