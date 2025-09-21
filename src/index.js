import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import { error } from './middlewares/error.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

app.use('/products', productRoutes);
app.use('/articles', articleRoutes);
app.use('/', commentRoutes);


app.use(error);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
