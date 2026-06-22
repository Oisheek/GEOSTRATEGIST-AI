const User =
  require("../models/User");

const generateToken =
  require("../utils/generateToken");

const {
  OAuth2Client,
} = require(
  "google-auth-library"
); const authService = require(
  "../services/auth.service"
);

exports.register = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    const user =
      await authService.registerUser(
        name,
        email,
        password
      );

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.login = async (
  req,
  res
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const data =
      await authService.loginUser(
        email,
        password
      );

    res.json(data);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
exports.googleLogin =
  async (req, res) => {

    // full google code here

  };

exports.me = async (
  req,
  res
) => {
  res.json({
    success: true,
    user: req.user,
  });
};