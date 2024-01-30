import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import router from './routes/apiRoutes.js';

const app = express();
dotenv.config();
app.use(bodyParser.json({limit:"30mb",extended : "true"}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:"true"}));
app.use(cookieParser());
app.use(cors({
    origin:["http://localhost:3000"],
    methods:["POST","GET","PUT"],
    credentials:true
}));

const PORT = process.env.PORT || 5000;
app.use("/api",router);

const URL = process.env.CONNECTION_URL;
mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => app.listen(PORT, () => console.log(`Server is running on port ${PORT}`)))
.catch((error) => console.log(error.message));
