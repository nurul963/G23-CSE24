import express from 'express';
import { login, register,refreshAccessToken, logout } from '../controllers/user.controller.js';
const router=express.Router();
router.post("/register",register);
router.post("/login",login);
router.get("/refresh",refreshAccessToken);
router.get("/logout",logout)
export default router;