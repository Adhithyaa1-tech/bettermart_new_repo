const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middlewares/error');
const fileupload = require('express-fileupload');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
var cors = require('cors')

// app.use(cors())
app.use(
    cors({
      credentials: true,
      origin: ["http://localhost:3000", "https://BetterMart.onrender.com"]
    })
);
                                                                                                                                                      
dotenv.config({
  path: "backend/config/config.env"
});


app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());
app.use(fileupload())
// app.use(fileupload({useTempFiles: true}))


const product = require('./routes/productRoute');
const user = require('./routes/userRoutes');
const order =require('./routes/orderRoute');
const payment = require('./routes/paymentRoute');

app.use('/api/v1', product);
app.use('/api/v1', user);
app.use('/api/v1', order);
app.use('/api/v1', payment);

app.use(errorMiddleware);


module.exports = app;