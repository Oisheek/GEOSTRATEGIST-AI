const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const registerUser = async (
  name,
  email,
  password
) => {
  const existingUser =
    await User.findOne({ email });

  if (existingUser) {
    throw new Error(
      "User already exists"
    );
  }

  const passwordHash =
    await bcrypt.hash(password, 10);

  const user =
    await User.create({
      name,
      email,
      passwordHash,
    });

  return user;
};

const loginUser = async (
  email,
  password
) => {
  const user =
    await User.findOne({ email });

  if (!user) {
    throw new Error(
      "Invalid credentials"
    );
  }

  const validPassword =
    await bcrypt.compare(
      password,
      user.passwordHash
    );

  if (!validPassword) {
    throw new Error(
      "Invalid credentials"
    );
  }

  const token =
    generateToken({
      id: user._id,
      role: user.role,
    });

  return {
    token,
    user,
  };
};

module.exports = {
  registerUser,
  loginUser,
};