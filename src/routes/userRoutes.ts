import express from 'express';
import { createUser, updateUser, deleteUser, getAllUser } from "../controllers/userController";
import { protect } from "../middleware/authMiddleware"

const router  = express.Router();

router.post('/createUser', protect, createUser);
router.put('/updateUser/:uuid', protect, updateUser);
router.delete('/deleteUser', protect, deleteUser);
router.get('/getAllUser', protect, getAllUser);

export default router
