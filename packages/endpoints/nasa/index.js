const axios = require("axios");

exports.fetchPhotoOfTheDay = async () => {
  const result = await axios(
    "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY"
  );

  const { url, hdurl, explanation } = result.data;

  return {
    url,
    hdurl,
    explanation
  };
};
