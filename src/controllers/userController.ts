import { Request, Response } from 'express';
import { User } from '../models/userModel';
import { generatePassword } from '../utils/passwordUtils';
import { sendDeleteUserEmail, sendUpdateUserEmail, sendWelcomeEmail } from '../utils/emailUtils';

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

export const updateUser = async (req: Request, res: Response) => {
    const { uuid } = req.params;
    const { name, email, phoneNumber, role } = req.body;

    try {
        // Find the user by UUID
        const user = await User.findOne({ uuid });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if email is provided and is different from the current email
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: 'Email is already in use.' });
            }
        }

        // Update fields only if they are provided
        if (name) user.name = name;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (role) user.role = role;

        // Save the updated user to the database
        await user.save();

        // Send update email
        await sendUpdateUserEmail(user.email, user.name);

        res.status(200).json({ message: 'User updated successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error, please try again later.' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { uuid } = req.body

    try {
        const user = await User.findOne({ uuid });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await User.findOneAndDelete({uuid})

        // Send update email
        await sendDeleteUserEmail(user.email, user.name)

        res.status(200).json({ message: 'User deleted successfully.', })
    } catch (err) {
        res.status(500).json({ error: 'Server error, please try again later.' });
    }
}

export const getAllUser = async (req: Request, res: Response) => {

    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string, 10);
        const skip = (page - 1) * limit;

        const users = await User.find()
            .skip(skip)
            .limit(limit)
            .select('-password')

        const total = await User.countDocuments();

        res.status(200).json({
            message: 'Users retrieved successfully',
            data: users,
            total: total,
            page: page
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error, please try again later.' });
    }
}