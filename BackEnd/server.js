const express = require("express");
const app = express();
require("dotenv").config();
require("./models/db");

app.use(express.json());

const roleRouter = require('./routers/RoleRouter');
const userRouter = require('./routers/userRoutes');
const categoryRouter = require('./routers/categoryRouter');
const productRouter = require('./routers/productRoutes');
const orderRouter = require('./routers/orderRoutes');
const cartRouter = require('./routers/cartRouter');
const reviewRouter = require('./routers/reviewRouter');

app.use('/role', roleRouter);
app.use('/user', userRouter);
app.use('/category', categoryRouter);
app.use('/products', productRouter);
app.use('/order', orderRouter);
app.use('/cart', cartRouter);
app.use('/review', reviewRouter);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`application listening at http://localhost:${PORT}`);
});