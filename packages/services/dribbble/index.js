const axios = require("axios");

exports.fetchLatestShots = async params => {
  const result = await axios(
    "https://api.dribbble.com/v2/user/shots?access_token=" + params.accessToken
  ).catch(err => {
    throw new Error(
      `${err.response.statusText}. ${err.response.data &&
        err.response.data.message}`
    );
  });

  return result.data.map(shot => ({
    description: shot.description.replace(/(<([^>]+)>)/gi, ""),
    image: shot.images.normal,
    link: shot.html_url
  }));
};
