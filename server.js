const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs'); // Import the fs module
require('dotenv').config();
const { ChatGroq } = require('@langchain/groq');
const { ChatPromptTemplate } = require('@langchain/core/prompts');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama3-8b-8192",
});

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `
     I will provide you with information about the user's interaction with a website. The numbers 
    in front of keywords represent the number of times the word is clicked or hovered upon. 
    Based on this information, tell me where the user's attention is most focused and what they 
    are trying to find on the website.Generate paragraph without the reasoning of how you arrived at your output.

    `
  ],
  ["human", "{input}"],
]);

app.post('/analyze', async (req, res) => {
  const { userInterests } = req.body;

  try {
    // Save userInterests to a file
    fs.writeFileSync('userInterests.txt', JSON.stringify(userInterests, null, 2), 'utf8');
    console.log('User interests data saved to userInterests.txt');

    const chain = prompt.pipe(model);
    const response = await chain.invoke({
      input: JSON.stringify(userInterests),
    });

    // Log the response from LLM
    console.log("LLM Response:", response);

    res.json({ response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
