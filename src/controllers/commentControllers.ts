import { Response} from 'express';
import { Comment } from '../models/commentModel';
import { Blog } from '../models/blogModel';

export const createBlogComment = async (req: any, res: Response) => {

    // id of the blog
    const { uuid } = req.params
    const { name, description } = req.body;

    // Validate required fields
    if (!name || !description) {
        return res.status(400).json({ error: 'All fields name and description are required.' });
    }

    try {
        const blog = await Blog.findOne({uuid});

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' })
        }

        const newComment = new Comment({
            name,
            description,
            blogId: blog.uuid
        })

        // Save the comment
        const savedComment = await newComment.save();

        // Add the comment reference to the blog
        blog.comments.push(savedComment.id);
        await blog.save();

        res.status(200).json({
            message: 'Comment added successfully',
            data: savedComment,
        });

    } catch (error) {
        throw error
    }
}

export const deleteComment = async (req:any, res:Response) => {
    
    const {uuid} = req.body;
    const user = req.user ;

    if(!user){
        return res.status(401).json({message: 'user not authenticated'})
    }

    try {
        const comment = await Comment.findOne({ uuid });

        if(!comment){
            return res.status(404).json({message:'Comment not found'})
        }
        
        // Find the associated blog by uuid (not by _id)
        const blog = await Blog.findOne({ uuid: comment.blogId });

        if(!blog){
            return res.status(404).json({message:"Associated blog not found"});
        }
        
        // Remove the comment from the comments array in the blogs
        blog.comments = blog.comments.filter((commentId) => commentId.toString() !== comment._id.toString());

        await blog.save();
        
        // Delete the comment from the Comment collection
        await Comment.findOneAndDelete({uuid});

        return res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        throw error
    }
}