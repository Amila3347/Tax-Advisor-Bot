import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'



dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors({
  origin: 'https://tax-advisor-bot.vercel.app'
}));
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from Tax Advisor!'
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createChatCompletion({
//       model: "davinci:ft-personal-2023-05-06-08-33-20",
      model: "gpt-3.5-turbo",
//       model: "ada:ft-tax-advisor:tax-advisor-bot-2023-05-07-03-34-33",
//       model: "gpt-3.5-turbo-0301",
      messages: [{ role: "user", content: `${prompt}` }],
      temperature: 1.0,
      max_tokens: 200,
    });

    res.status(200).send({
      bot: response.data.choices[0].message.content,
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))
