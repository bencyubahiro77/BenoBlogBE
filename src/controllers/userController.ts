import { Request, Response } from 'express';
import { User } from '../models/userModel';
import { generatePassword } from '../utils/passwordUtils';
import { sendWelcomeEmail } from '../utils/emailUtils';

export const createUser = async (req: Request, res: Response) => {
    const { name, email, phoneNumber, role } = req.body;

    // Validate required fields
    if (!name || !email || !phoneNumber || !role) {
        return res.status(400).json({ error: 'All fields (name, email, phoneNumber, role) are required.' });
    }

    try {
        // Check if email is already taken
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already in use.' });
        }

        // Generate a secure password
        const password = generatePassword(10); // Use the expected password length (e.g., 10 characters)

        // Create new user
        const user = new User({
            name,
            email,
            phoneNumber,
            role,
            password, // Save the password field correctly
        });

        await user.save();

        // Send welcome email
        await sendWelcomeEmail(email, name, password);

        res.status(201).json({ message: 'User created successfully' });
    } catch (err: any) {
        res.status(500).json({ error: 'Server error, please try again later.' });
    }
};
