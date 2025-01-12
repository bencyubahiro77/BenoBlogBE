import express from 'express';
import cors from "cors";
import dotenv from 'dotenv';
import connectDB from './config/dbConfig';
// import { seedAdmin } from './utils/seedAdmin';
import authRoutes from "./routes/authRoutes"
import userRoutes from "./routes/userRoutes";
import blogRoutes from "./routes/blogRoutes";

dotenv.config();
// MongoDB connection
connectDB();

const app = express();
const PORT = process.env.PORT;
app.use(express.json());

app.use(cors({ origin: '*' }));

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/blog', blogRoutes);

const startServer = async () => {
  // Seed admin user
  // await seedAdmin(); 
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};
  
startServer();