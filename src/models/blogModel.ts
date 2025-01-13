import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import { IBlog  } from '../types/types';

const blogSchema = new Schema<IBlog>({
    uuid: { type: String, unique: true, default: uuidv4 },
    title: { type: String, required: true },
    coverImage: { type: String, required: false },
    description: { type: String, required: true },
    category: { 
        type: String, 
        enum: ['politics', 'technology', 'business', 'health', 'sports', 'other'], 
        required: true 
    },
    author: {
        type: String, 
        required: true,
        ref: 'User'
    },
    authorId: {
        type: String, 
        required: true,
        ref: 'User'
    },
    comments:[ {
        type: Schema.Types.ObjectId,
        ref: 'Comment', 
    },]
},
    { timestamps: true }
);

export const Blog = mongoose.model<IBlog>('Blog', blogSchema);
