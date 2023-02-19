const axios = require("axios");

const call = async (prompt) => {
  const api_key = process.env.OPENAI_TOKEN;
  const model = "text-davinci-003";
  const max_tokens = 2000;
  const temperature = 0;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model,
        prompt,
        max_tokens,
        temperature,
        stop: "\n\n\n",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${api_key}`,
        },
      }
    );

    console.log(response.data);
    // return response.data.choices[0].text but remove new lines that happen before any characters
    return response.data.choices[0].text.replace(/\n\n\n/g, "\n\n");
  } catch (error) {
    throw error;
  }
};

module.exports = { call };
