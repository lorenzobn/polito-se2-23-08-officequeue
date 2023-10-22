const bcrypt = require("bcrypt");
const { UserType } = require("./auth");

export const registerUser = async (req, res) => {
  try {
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      type: UserType.notVerified,
    });
    await newUser.save();
    res.status(201).json({ msg: "user created", data: newUser });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "An unknown error occurred." });
  }
};

export const updateUser = async (req, res) => {
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

export const getUsers = async (req, res) => {
  try {
    let users = await User.findAll();
    const usersWithoutPasswords = users.map((user) => {
      const { id, name, email, type, createdAt, updatedAt } = user;
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
