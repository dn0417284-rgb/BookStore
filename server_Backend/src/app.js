const express = require('express');
const cors = require('cors');

const authRoutes =
  require('./routes/auth.route');

const productRoutes = require('./routes/product.routes');

const orderRoutes =
require('./routes/order.routes');

const app = express();

app.use(cors());

app.use(express.json());

app.use(
  '/api/auth',
  authRoutes
);

app.use('/api/orders', orderRoutes);

app.use('/api/products', productRoutes);

module.exports = app;