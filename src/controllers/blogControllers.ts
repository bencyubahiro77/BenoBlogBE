import { Response, Request } from 'express';
import { Blog } from '../models/blogModel';

const isAuthorized = (user: any, blog: any): boolean => {
    return user.role === 'admin' || user.id === blog.authorId;
};

export const createBlog = async (req:any, res:Response) => {
    const { title,description, category } = req.body;
    
    const user = req.user ;

    if(!user){
        return res.status(401).json({message: 'user not authenticated'})
    }

    // Check if required fields are provided
    if (!title || !description || !category) {
        return res.status(400).json({ error: 'Title, description and category are required.' });
    }
    
    try {
        const newBlog = new Blog({
            title,
            coverImage: req.file?.path ,
            description,
            category,
            author:user.name,   // Author's name from the token
            authorId: user.id
        })
        
        // Save the blog post to the database
        await newBlog.save();
        
        // Return a success message with the newly created blog
        res.status(200).json({
            message: 'Blog created successfully',
            data: newBlog
        })

    } catch ( error) {
        throw error
    }
}

export const getAllBlog =  async (req: Request, res: Response) => {

    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string, 10);
        const skip = (page - 1) * limit;

        const blogs = await Blog.find()
            .skip(skip)
            .limit(limit)
            .populate('comments')

        const total = await Blog.countDocuments();
        res.status(200).json({
            message: 'Blogs retrieved successfully',
            data: blogs,
            total: total,
            page: page
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error, please try again later.' });
    }
}

export const getOneBlog =  async (req: Request, res: Response) => {
    const { uuid } = req.body

    try {
        const blog = await Blog.findOne({ uuid }).populate('comments');

        if(!blog){
            return res.status(404).json({message:'blog not found'})
        }
        
        res.status(200).json({
            message: 'Blogs retrieved successfully',
            data: blog
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error, please try again later.' });
    }
}

export const updateOneBlog = async (req: any, res: Response) => {
    const { uuid } = req.params
    const { title,description, category, coverImage } = req.body;

    const user = req.user ;

    if(!user){
        return res.status(401).json({message: 'user not authenticated'})
    }

    try {
        // Find the user by UUID
        const blog = await Blog.findOne({ uuid });

        if(!blog){
            return res.status(404).json({message:'blog not found'})
        }

        // Authorization check
        if (!isAuthorized(user, blog)) {
            return res.status(403).json({ error: 'You are not authorized to delete this blog' });
        }

        // Update blog fields
        blog.title = title || blog.title;
        blog.description = description || blog.description;
        blog.category = category || blog.category;
        blog.coverImage = req.file?.path || blog.coverImage; 

        // Save updated blog
        const updatedBlog = await blog.save();

        res.status(200).json({
            message: 'Blog updated successfully',
            data: updatedBlog,
        });
    } catch (error) {
        throw error;
    } 
}

export const deleteBlog = async (req: any, res:Response) =>{
    const { uuid } = req.body;
    const user  = req.user;

    try {
        const blog = await Blog.findOne({ uuid });

        if(!blog){
            return res.status(404).json({message:'blog not found'})
        }

        // Authorization check
        if (!isAuthorized(user, blog)) {
            return res.status(403).json({ error: 'You are not authorized to delete this blog' });
        }

        await Blog.findOneAndDelete({uuid})

        return res.status(200).json({ message: 'Blog deleted successfully' });

    } catch (error) {
        throw error
    }
}