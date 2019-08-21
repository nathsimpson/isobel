const ISOBEL = require("@isobel/core");

// utils
const fileSystem = require("@isobel/file-system");
const S3 = require("@isobel/s3");
const toMs = require("to-ms");

// services
const nasa = require("@isobel/nasa");
const twitter = require("@isobel/twitter");
const dribbble = require("@isobel/dribbble");
const youtube = require("@isobel/youtube");
const github = require("@isobel/github");

const services = [
  {
    name: "dribbble",
    func: dribbble.fetchLatestShots,
    interval: toMs.hours(24),
    params: {
      accessToken: process.env.DRIBBBLE_ACCESS_TOKEN
    }
  },
  {
    name: "twitter",
    func: twitter.fetchLatestTweets,
    interval: toMs.hours(6),
    params: {
      username: "nathjsimpson"
    }
  },
  {
    name: "nasa",
    func: nasa.fetchPhotoOfTheDay,
    interval: toMs.hours(24)
  },
  {
    name: "youtube",
    func: youtube.getChannelStats,
    interval: toMs.hours(24),
    params: {
      channelId: "UCa__hNMzVWIQOHErctX0leg"
    }
  },
  {
    name: "github",
    func: github.getProfile,
    interval: toMs.hours(24)
  }
];

// initialise
const Isobel = new ISOBEL({
  cache: process.env.NODE_ENV === "production" ? S3 : fileSystem,
  services
});

Isobel.start().catch(error => {
  console.error("Error:", error);
  process.exit(1);
});
