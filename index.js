const JARVIS = require("./core.js");

// utils
const fileSystem = require("./utils/fileSystem");
const S3 = require("./utils/S3");
// const sendExpoNotification = require("./utils/expoNotifications");

// endpoints
const nasa = require("./endpoints/nasa");
const twitter = require("./endpoints/twitter");
const dribbble = require("./endpoints/dribbble");

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
  port: process.env.PORT || 4000,
  cache: fileSystem,
  endpoints
});

jrvs.start();

jrvs.app.listen(err => {
  if (err) console.error(err);
  console.log("> starting caching");
});
