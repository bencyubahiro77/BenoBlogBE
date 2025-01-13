import { Response, Request } from 'express';
import { Blog } from '../models/blogModel';

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
            author:user.name   // Author's name from the token
        })
        
        // Save the blog post to the database
        await newBlog.save();
        
        // Return a success message with the newly created blog
        res.status(200).json({
            message: 'Blog created successfully',
            data: newBlog
        })

    } catch ( error) {
        res.status(500).json({ error: 'Server error, please try again later.' });
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
        const blog = await Blog.findOne({ uuid });

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