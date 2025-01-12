import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs';
import { IUser } from '../types/types';
import { v4 as uuidv4 } from 'uuid';

const userSchema = new Schema<IUser>(
  {
    uuid: { type: String, unique: true, default: uuidv4 },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    role: { type: String, enum: ['admin', 'author'], default: 'author' },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.pre('save', async function(next){
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (
    candidatePassword: string
  ): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);