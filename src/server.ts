import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './config/data-source';
import fileRequestRoute from '../src/routes/fileRequestRoutes'
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import userRoutes from "./routes/userRoutes";
import { requireAuth } from './middleware/requireAuth';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//for clerk authentication
app.use(ClerkExpressWithAuth({}) as unknown as express.RequestHandler);

//Endpoints
app.use("/api/user", requireAuth, userRoutes);
app.use("/api/file-request", requireAuth, fileRequestRoute)

const PORT = process.env.PORT;

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`=>Server running on PORT:${PORT}`);
    })
  })
  .catch((err) => {
    console.error("Database connection failed", err);
  })

