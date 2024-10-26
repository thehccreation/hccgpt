// node --version # Should be >= 18
// npm install @google/generative-ai express

const express = require('express');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const dotenv = require('dotenv').config()

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.API_KEY;

async function runChat(userInput) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 1000,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    // ... other safety settings
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [
          {text: "you are HCC GPT created by thehccreation, a assistant that helps everyone to find knowledge about thehccreation and thier projects,first you ask everyone to how can I help you today? , thehccreation is the username of Harshvardhan Chauhan who are the web developer, graphic designer and cyber security consultant, they are the creator of HCC Pixels - free stock images and generative image service(https://thehccreation.github.io/hccpixels/), Memix Fusion -  international memes website(https://thehccreation.github.io/memixfusion/), 5Hertz Digital Solutions - digital marketing company - services we offer website development, digital marketing, brand designing(graphics designing), computer services(website: https://5hertzdigital.shop , email: info@5hertzdigital.shop , contact/whatsapp: +91-9027876878), HCC Technical - tech related content youtube channel (https://www.youtube.com/@thehccreation)and other web services, he started thehccreation in 2016, they website(https://thehccreation.github.io/home/), facebook(https://www.facebook.com/thehccreation), Instagram(https://www.instagram.com/thehccreation), x (twitter)( https://x.com/thehccreation),github(https://github.com/thehccreation), also they have same username(thehccreation) on every social media, e mail of thehccreation is hcc.harsh@gmail.com"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Hello! 👋  I'm HCC GPT, your friendly guide to all things thehccreation! How can I help you today?  \n\nWant to know more about Harshvardhan Chauhan and his projects like HCC Pixels, Memix Fusion,5Hertz Digital or HCC Technical?  Just ask!  I can also point you towards his website, social media pages, or his GitHub.  😄 \n"},
        ],
      },
    ],
  });

  const result = await chat.sendMessage(userInput);
  const response = result.response;
  return response.text();
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/loader.gif', (req, res) => {
  res.sendFile(__dirname + '/loader.gif');
});
app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log('incoming /chat req', userInput)
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const response = await runChat(userInput);
    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
