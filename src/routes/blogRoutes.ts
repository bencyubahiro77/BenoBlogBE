import express from 'express';
import { createBlog, getAllBlog, getOneBlog, deleteBlog, updateOneBlog } from "../controllers/blogControllers";
import { protect } from "../middleware/authMiddleware";
import upload from "../config/multerConfig"

const router  = express.Router();

router.post('/createBlog', protect(['admin','author']), upload.single('coverImage'), createBlog);
router.put('/updateBlog/:uuid', protect(['admin','author']), upload.single('coverImage'), updateOneBlog)
router.delete('/deleteBlog', protect(['admin','author']), deleteBlog);

router.get('/getAllBlog', getAllBlog);
router.get('/getoneBlog', getOneBlog);

export default router