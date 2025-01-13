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
}

export interface IProtectMiddleware {
    roles: string[];
}
