import mongoose, { Schema} from "mongoose";
import { IComment } from "../types/types"
import { v4 as uuidv4 } from 'uuid';


const commmentSchema = new Schema<IComment>({
    uuid: { type: String, unique: true, default: uuidv4 },
    name: { type: String, required: false },
    description: { type: String, required: true },
    blogId: {
        type: String, 
        required: true,
        ref: 'Blog'
    } 
},
    { timestamps: true }
);

export const Comment = mongoose.model<IComment>('Comment', commmentSchema);