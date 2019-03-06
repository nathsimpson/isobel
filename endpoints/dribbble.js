const axios = require("axios");

exports.fetchLatestShots = async () => {
  const result = await axios(
    "https://api.dribbble.com/v2/user/shots?access_token=" +
      process.env.DRIBBBLE_ACCESS_TOKEN
  );

  return result.data.map(shot => ({
    description: shot.description.replace(/(<([^>]+)>)/gi, ""),
    image: shot.images.normal,
    link: shot.html_url
  }));
};
