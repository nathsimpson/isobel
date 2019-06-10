const axios = require("axios");
const apiKey = process.env.YOUTUBE_API_KEY;

exports.getChannelStats = async params => {
  // check if all params are set
  ["channelId"].forEach(key => {
    if (!params[key]) {
      throw new Error(`${key} is not set in params`);
    }
  });

  const result = await axios(
    `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${
      params.channelId
    }&key=${apiKey}`
  ).catch(err => {
    throw new Error(err.response.statusText);
  });

  return result.data.items[0].statistics;
};
