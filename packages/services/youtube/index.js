const axios = require("axios");
const channelId = process.env.YOUTUBE_CHANNEL_ID;
const apiKey = process.env.YOUTUBE_API_KEY;

exports.getChannelStats = async () => {
  const result = await axios(
    `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`
  ).catch(err => {
    console.log(err.response);
    throw new Error(err.response.statusText);
  });

  return result.data.items[0].statistics;
};
