//import saveToS3 from '../utils/saveToS3';
import saveToFile from '../utils/saveToFile';

var Twit = require("twit");

const twitter = async (req, res) => {
  var T = new Twit({
    consumer_key:  process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
    strictSSL: true // optional - requires SSL certificates to be valid.
  });

  var params = {
    screen_name: "nathansimpson95",
    count: 10
  };

  function gotData(data) {
    console.log(data);
    const json = {
      data: data
    };

    if (process.env.SAVE_OFFLINE === "true") saveToFile("twitter", json);
    //if (process.env.SAVE_ONLINE === 'true') saveToS3('calendar', results);
    if (res) res.json(json);
    return true;
  }

  T.get("statuses/user_timeline", params, function(err, data, response) {
    gotData(data);
  });
};

export default twitter;
