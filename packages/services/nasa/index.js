const axios = require("axios");

exports.fetchPhotoOfTheDay = async () => {
  const result = await axios
    .get("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY")
    .catch(err => {
      throw new Error(err.response.statusText);
    });

  const { url, hdurl, explanation } = result.data;

  return {
    url,
    hdurl,
    explanation
  };
};
