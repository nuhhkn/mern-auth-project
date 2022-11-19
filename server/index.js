import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import userRouter from './routers/users.js';

const app = express();

dotenv.config();

app.use(cors());

app.use(express.json());
app.use('/users', userRouter);

app.listen(process.env.PORT, () => {
   mongoose
      .connect(process.env.DB)
      .then(() => {
         console.log(`App started | URL: http://localhost:${process.env.PORT}`);
      })
      .catch((err) => console.error(err));
});