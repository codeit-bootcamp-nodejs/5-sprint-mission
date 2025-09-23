import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/products', productRoutes);

export default app;
