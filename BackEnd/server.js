const express = require("express");
const https=require("https");
const fs=require("fs");
const app = express();
require("dotenv").config();
require("./models/db");
app.use(express.json());
const roleRouter=require('./routers/RoleRouter');
const userRouter=require('./routers/userRoutes');
app.use('/role',roleRouter);
app.use('/user',userRouter);
const sslOptions={
  key:fs.readFileSync(process.env.SSL_KEY_PATH),
  cert:fs.readFileSync(process.env.SSL_CERT_PATH)
}
https.createServer(sslOptions,app).listen(process.env.PORT, () => {
  console.log(`Secure server running at https://localhost:${process.env.PORT}`);
});