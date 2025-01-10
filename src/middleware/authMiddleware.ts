import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const protect = (req: any, res: Response, next: NextFunction) => {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: Token not provided or invalid format' });
    }

    const token = authHeader.split(' ')[1]; // Split on space and get the token

    try {
        // Decode the token using the secret key from the environment
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

        // Attach user information to the request object
        req.user = decoded;

        // Check if the user has the 'admin' role
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admin role required' });
        }

        // If user is an admin, proceed to the next middleware or route handler
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token invalid' });
    }
};
