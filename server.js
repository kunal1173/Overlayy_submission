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
   You are a sales crawler who is getting each and every action of the user when he came on the website,  you need to give me a crisp, clear and impactful summary of what the user seemed more interested in based on the above inputs. Your output should be strictly inferred from the inputs. Your output would directly be shown to the clients who are the owners of the website and would pay us so make sure it's in a simple yet impactful language

    `
  ],
  ["human", "{input}"],
]);

app.post('/analyze', async (req, res) => {
  const { userInterests } = req.body;

  try {
   
    fs.writeFileSync('userInterests.txt', JSON.stringify(userInterests, null, 2), 'utf8');
    console.log('User interests data saved to userInterests.txt');

    const chain = prompt.pipe(model);
    const response = await chain.invoke({
      input: JSON.stringify(userInterests),
    });

 
    console.log("LLM Response:", response);

    
    res.json({ response: response.text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
