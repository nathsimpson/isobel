const Twit = require("twit");

const T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  strictSSL: true // optional - requires SSL certificates to be valid.
});

exports.fetchLatestTweets = async () => {
  const final = await T.get("statuses/user_timeline", {
    screen_name: "nathansimpson95",
    count: 10,
    exclude_replies: true,
    include_rts: false
  }).catch(function(err) {
    console.log("caught error", err.stack);
  });

  return final.data.map(tweet => ({
    id: tweet.id,
    text: tweet.text,
    place: tweet.place ? tweet.place.full_name : null,
    image: tweet.entities.media ? tweet.entities.media[0].display_url : null
  }));
};
