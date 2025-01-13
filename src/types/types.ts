import { Types } from "mongoose";

export interface IUser {
    uuid:string;
    name: string;
    email: string;
    phoneNumber: string;
    role: 'admin' | 'author';
    password: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IBlog {
    uuid: string;
    title: string;
    coverImage?: string;
    description: string;
    category: 'politics' | 'technology' | 'business' | 'health' | 'sports' | 'other'; 
    author: string; 
    authorId:string
    comments: Types.ObjectId[];
}

export interface IProtectMiddleware {
    roles: string[];
}

export interface IComment {
    uuid: string;
    name: string;
    description: string;
    blogId:string
}