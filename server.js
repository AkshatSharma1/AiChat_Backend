import express from "express";
import bodyParser from "body-parser";
import cors from 'cors'
import morgan from "morgan";
import helmet from "helmet"
import dotenv from "dotenv"
import { Configuration, OpenAIApi } from "openai";
import openAiRoutes from './routes/openai.js'
import authRoutes from './routes/authRoutes.js'

dotenv.config()

const app = express()

//Middlewares
app.use(express.json());
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}))
app.use(morgan("common"))
app.use(bodyParser.json({extended: true}))
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors());

/* OPENAI Configuration */
const configuration = new Configuration({
    apiKey: process.env.OPEN_API_KEY, 
});
console.log(configuration)

//bcoz we need to use it in another file
export const openai = new OpenAIApi(configuration)

/* ROUTES */
app.use("/openai", openAiRoutes);
app.use("/auth", authRoutes);

// Starting the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`App is running at http://localhost:${PORT}`)
})

