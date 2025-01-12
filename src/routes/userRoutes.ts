import express from 'express';
import { createUser, updateUser, deleteUser, getAllUser } from "../controllers/userController";
import { protect } from "../middleware/authMiddleware"

const router  = express.Router();

router.post('/createUser', protect(['admin']), createUser);
router.put('/updateUser/:uuid', protect(['admin']), updateUser);
router.delete('/deleteUser', protect(['admin']), deleteUser);
router.get('/getAllUser', protect(['admin']), getAllUser);

export default router
