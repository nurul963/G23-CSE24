import express from 'express';
import { isAuthenticated } from '../middleware/isAuthenticated.js';
import { getProfile } from '../controllers/student.controller.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
const router=express.Router();
router.get("/",isAuthenticated,roleMiddleware('ADMIN','STUDENT'),getProfile);
export default router;