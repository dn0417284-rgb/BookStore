import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

import './src/config/db.js';

import productRoutes from './src/routes/product.routes.js';
// import authRoutes from './src/routes/auth.route.js';
//import customerRoutes from './src/routes/customer.route.js';
import orderRoutes from './src/routes/order.routes.js';
import cartRoutes from './src/routes/cart.routes.js';
import addressRoutes from './src/routes/address.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);

// app.use('/api/auth', authRoutes);

// app.use('/api/customers', customerRoutes);

app.use('/api/orders', orderRoutes);

app.use('/api/cart', cartRoutes);

app.use('/api/addresses', addressRoutes);

// Home
app.get('/', (req, res) => {
res.send('BookStore API Running...');
});

// MoMo return URL
app.get('/payment-return', (req, res) => {

  const orderId =
    req.query.orderId;

  const realId =
    orderId.split('_')[0];

  res.redirect(
    `http://localhost:4200/orders/${realId}`
  );

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
