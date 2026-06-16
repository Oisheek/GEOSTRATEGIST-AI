const express =
  require("express");

const router =
  express.Router();

const {
  register,
  login,
  me,
  googleLogin,
} = require(
  "../controllers/auth.controller"
);
const authMiddleware =
  require("../middleware/auth");

router.get(
  "/me",
  authMiddleware,
  me
);


router.post(
  "/register",
  register
);

router.post(
  "/login",
  login
);
router.post(
  "/google",
  googleLogin
);
router.get(
  "/me",
  authMiddleware,
  me
);
module.exports = router;