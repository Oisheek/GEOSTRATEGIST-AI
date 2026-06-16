const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

  console.log("AUTH HEADER:");
  console.log(req.headers.authorization);

  const authHeader =
    req.headers.authorization;

  if (!authHeader) {

    return res.status(401).json({
      message: "Unauthorized",
    });

  }

  try {

    const token =
      authHeader.split(" ")[1];

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    console.log("DECODED USER:");
    console.log(decoded);

    req.user = decoded;

    next();

  } catch (err) {

    console.log(err);

    return res.status(401).json({
      message: "Invalid Token",
    });

  }

};