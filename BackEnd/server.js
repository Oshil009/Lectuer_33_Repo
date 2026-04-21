const express = require("express");
const app = express();
require("dotenv").config();
require("./models/db");
const cors = require('cors');
const passport = require('passport');
require('./config/passport');
const allowedOrigins = [
    process.env.FRONTEND_URL, 
    'http://localhost:5173',
    'https://shopnow01.vercel.app'
];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(passport.initialize());
app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});

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
