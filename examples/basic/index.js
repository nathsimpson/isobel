const ISOBEL = require("@isobel/core");

// utils
const fileSystem = require("@isobel/file-system");
const S3 = require("@isobel/s3");
// const sendExpoNotification = require("./utils/expoNotifications");

// endpoints
const nasa = require("@isobel/nasa");
const twitter = require("@isobel/twitter");
const dribbble = require("@isobel/dribbble");

const hours = n => n * 60 * 60 * 1000;

const endpoints = [
  {
    name: "dribbble",
    func: dribbble.fetchLatestShots,
    interval: hours(24)
  },
  {
    name: "twitter",
    func: twitter.fetchLatestTweets,
    interval: hours(6)
  },
  {
    name: "nasa",
    func: nasa.fetchPhotoOfTheDay,
    interval: hours(24)
  }
];

// initialise
const iz = new ISOBEL({
  port: process.env.PORT || 3000,
  cache: process.env.NODE_ENV == "production" ? S3 : fileSystem,
  endpoints
});

iz.start();

iz.app.listen(err => {
  if (err) console.error(err);
  console.log("⚙️ Starting caching");
});
