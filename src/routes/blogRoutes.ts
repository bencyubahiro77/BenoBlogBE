import express from 'express';
import { createBlog, getAllBlog, getOneBlog } from "../controllers/blogControllers";
import { protect } from "../middleware/authMiddleware";

const router  = express.Router();

router.post('/createBlog', protect(['admin','author']), createBlog);
router.get('/getAllBlog', getAllBlog);
router.get('/getoneBlog', getOneBlog);

export default router