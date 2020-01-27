const { Router } = require("express");
const router = Router();
const {
  login,
  loginMiddlewares,
  register,
  registerMiddlewares,
  checkTokenVerified
} = require("../controllers/auth.controller");
const authMiddleware = require('../middleware/auth.middleware');

// /api/auth/register
router.get("/", authMiddleware, checkTokenVerified);

// /api/auth/register
router.post("/register", registerMiddlewares, register);

// /api/auth/login
router.post("/login", loginMiddlewares, login);

module.exports = router;
