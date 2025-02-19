import express from "express";
import { Register } from "../app/controllers/auth/RegisterController";
import authValidation from "../middlewares/validation/authValidation";
import { Login } from "../app/controllers/auth/LoginController";

const router = express.Router();

router.post("/register", authValidation.register, Register);
router.post("/login", authValidation.login, Login);

export default router;
