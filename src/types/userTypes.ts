export interface IUser {
    uuid:string;
    name: string;
    email: string;
    phoneNumber: string;
    role: 'admin' | 'author';
    password: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}