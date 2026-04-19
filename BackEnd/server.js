const express = require("express");
const app = express();
require("dotenv").config();
require("./models/db");
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "connect-src 'self' http://localhost:5000",
        "font-src 'self'"
    ].join('; '));
    next();
});
const roleRouter     = require('./routers/RoleRouter');
const userRouter     = require('./routers/userRoutes');
const categoryRouter = require('./routers/categoryRouter');
const productRouter  = require('./routers/productRoutes');
const orderRouter    = require('./routers/orderRoutes');
const cartRouter     = require('./routers/cartRouter');
const reviewRouter   = require('./routers/reviewRouter');
app.use('/role',     roleRouter);
app.use('/user',     userRouter);
app.use('/category', categoryRouter);
app.use('/products', productRouter);
app.use('/order',    orderRouter);
app.use('/cart',     cartRouter);
app.use('/review',   reviewRouter);
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