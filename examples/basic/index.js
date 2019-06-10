const ISOBEL = require("@isobel/core");

// utils
const fileSystem = require("@isobel/file-system");
const S3 = require("@isobel/s3");
// const sendExpoNotification = require("./utils/expoNotifications");

// endpoints
const nasa = require("@isobel/nasa");
const twitter = require("@isobel/twitter");
const dribbble = require("@isobel/dribbble");
const youtube = require("@isobel/youtube");
const github = require("@isobel/github");

const hours = n => n * 60 * 60 * 1000;

const endpoints = [
  {
    name: "dribbble",
    func: dribbble.fetchLatestShots,
    interval: hours(24),
    params: {
      accessToken: process.env.DRIBBBLE_ACCESS_TOKEN
    }
  },
  {
    name: "twitter",
    func: twitter.fetchLatestTweets,
    interval: hours(6),
    params: {
      username: "nathjsimpson"
    }
  },
  {
    name: "nasa",
    func: nasa.fetchPhotoOfTheDay,
    interval: hours(24)
  },
  {
    name: "youtube",
    func: youtube.getChannelStats,
    interval: hours(24),
    params: {
      channelId: "UCa__hNMzVWIQOHErctX0leg";
    }
  },
  {
    name: "github",
    func: github.getProfile,
    interval: hours(24)
  }
];

// initialise
const Isobel = new ISOBEL({
  port: process.env.PORT || 3000,
  cache: process.env.NODE_ENV == "production" ? S3 : fileSystem,
  endpoints
});

Isobel.start();

Isobel.app.listen(err => {
  if (err) console.error(err);
  console.log("⚙️ Starting caching");
});
