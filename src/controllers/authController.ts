import { Request, Response } from 'express';
import { User } from '../models/userModel';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({ email});
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({ message: 'Incorrect Email or Password'});
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        const token = jwt.sign({ id: user.uuid, role: user.role, name:user.name}, process.env.JWT_SECRET!, {
            expiresIn: '1y',
        });

        res.status(200).json({message:"Logged in successfully","token":token});

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}