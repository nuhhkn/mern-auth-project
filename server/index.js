import express from 'express';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import userRouter from './routers/users.js';

const app = express();

config();

app.use(cors());

app.use(express.json());
app.use('/users', userRouter);

app.listen(process.env.port, () => {
  mongoose
    .connect(process.env.db_connect_uri)
    .then(() => {
      console.log(`App started | URL: http://localhost:${process.env.PORT}`);
    })
    .catch((err) => console.error(err));
});
