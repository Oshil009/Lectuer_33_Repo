const express = require("express");
const https=require("https");
const fs=require("fs");
const app = express();
require("dotenv").config();
require("./models/db");
app.use(express.json());
const roleRouter=require('./routers/RoleRouter');
const userRouter=require('./routers/userRoutes');
const categoryRouter=require('./routers/categoryRouter');
const productRouter = require('./routers/productRoutes');
app.use('/role',roleRouter);
app.use('/user',userRouter);
app.use('/category',categoryRouter);
app.use('/products', productRouter);
const sslOptions={
  key:fs.readFileSync(process.env.SSL_KEY_PATH),
  cert:fs.readFileSync(process.env.SSL_CERT_PATH)
}
https.createServer(sslOptions,app).listen(process.env.PORT, () => {
  console.log(`Secure server running at https://localhost:${process.env.PORT}`);
});