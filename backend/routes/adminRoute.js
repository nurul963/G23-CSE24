import express from 'express';
import { getAllUser } from '../controllers/admin.controller.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';
const router=express.Router();
router.get("/",isAuthenticated,getAllUser);
export default router;