import express from 'express'
import axios from 'axios'
import dotenv from 'dotenv'
import { openai } from '../server.js'

dotenv.config()

// Setting up the Router
const router = express.Router();

//calling the api

//(path, handler): Route for text generation
router.post("/text", async (req, res)=>{
    try {

        const { text, activeChat } = req.body;
        console.log(activeChat)

        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
            { role: "system", content: "You are a helpful assistant." }, // this represents the bot and what role they will assume
            { role: "user", content: text }, // the message that the user sends

            //if you wanted to keep the "threads" that exist on ChatGPT, you would have to save the
            // messages that the bot sends and then provide them to the bot in the next request.
            ],
        });

        await axios.post(
            `https://api.chatengine.io/chats/${activeChat}/messages/`,
            { text: response.data.choices[0].message.content },
            {
            headers: {
                "Project-ID": process.env.PROJECT_ID,
                "User-Name": process.env.BOT_USER_NAME,
                "User-Secret": process.env.BOT_USER_SECRET,
            },
            }
        );

        res.status(200).json({ text: response.data.choices[0].message.content });
    } catch (error) {
       console.error("error:", error)
       res.status(500).json({error: error.message})
    }
});

//AICODE route
router.post("/code", async (req, res) => {
      try {
        const { text, activeChat } = req.body;
        
    
        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are an assistant coder who responds with only code and no explanations.",
            }, // this represents the bot and what role they will assume
            { role: "user", content: text }, // the message that the user sends
          ],
        });
    
        await axios.post(
          `https://api.chatengine.io/chats/${activeChat}/messages/`,
          { text: response.data.choices[0].message.content },
          {
            headers: {
              "Project-ID": process.env.PROJECT_ID,
              "User-Name": process.env.BOT_USER_NAME,
              "User-Secret": process.env.BOT_USER_SECRET,
            },
          }
        );
    
        res.status(200).json({ text: response.data.choices[0].message.content });
      } catch (error) {
        console.error("error", error.response.data.error);
        res.status(500).json({ error: error.message });
      }
    });

//AI Assist Route
router.post("/assist", async (req, res)=>{
  try {
    const {text, activeChat} = req.body;

    //now extract the text and use it
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages:[
        {
          role: "system",
          content:"You are a helpful assistant that serves to only complete user's thoughts or sentences.",

        },
        {
          role: "user",
          content: `Finish my thought: ${text}`
        }
      ]
    });

    res.status(200).json({ text: response.data.choices[0].message.content });
  } catch (error) {
    console.error("error", error.response.data.error);
    res.status(500).json({ error: error.message });    
  }
})

export default router