import express from 'express';
import { createBlogComment, deleteComment} from '../controllers/commentControllers';
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post('/addComment/:uuid', createBlogComment);
router.delete('/removeComment', protect(['admin']), deleteComment);

export default router;
