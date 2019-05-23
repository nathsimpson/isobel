const JARVIS = require("./packages/core");

// utils
const fileSystem = require("./packages/fileSystem");
const S3 = require("./packages/S3");
// const sendExpoNotification = require("./utils/expoNotifications");

// endpoints
const nasa = require("./packages/endpoints/nasa");
const twitter = require("./packages/endpoints/twitter");
const dribbble = require("./packages/endpoints/dribbble");

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
const jrvs = new JARVIS({
  port: process.env.PORT || 3000,
  cache: process.env.NODE_ENV == "production" ? S3 : fileSystem,
  endpoints
});

jrvs.start();

jrvs.app.listen(err => {
  if (err) console.error(err);
  console.log("⚙️ Starting caching");
});
