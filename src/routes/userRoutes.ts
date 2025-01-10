import express from 'express';
import { createUser } from "../controllers/userController";
import { protect } from "../middleware/authMiddleware"

const router  = express.Router();

router.post('/createUser', protect, createUser)

export default router
