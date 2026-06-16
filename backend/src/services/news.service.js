const axios = require("axios");

exports.fetchWorldNews = async function () {
  try {

    const response = await axios.get(
      "https://api.worldnewsapi.com/search-news",
      {
        params: {
          "api-key":
            process.env.WORLDNEWS_API_KEY,

          language: "en",

          number: 50,
        },
      }
    );

    return response.data.news || [];

  } catch (err) {

    console.log(
      "WORLDNEWS ERROR STATUS:",
      err.response?.status
    );

    console.log(
      "WORLDNEWS ERROR DATA:"
    );

    console.log(
      err.response?.data
    );

    return [];
  }
};

exports.fetchHeadlineFeed = async function () {

  try {

    const response = await axios.post(
      "https://api.headlinefeed.dev/api/search",

      {
        title: "",
      },

      {
        headers: {
          Authorization:
            `Bearer ${process.env.HEADLINEFEED_API_KEY}`,
        },
      }
    );

    return (
      response.data.headlines || []
    );

  } catch (err) {

    console.log(
      "HEADLINEFEED ERROR STATUS:",
      err.response?.status
    );

    console.log(
      "HEADLINEFEED ERROR DATA:"
    );

    console.log(
      err.response?.data
    );

    return [];
  }
};