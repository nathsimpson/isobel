// const readFromFile = require("./utils/readFromFile");
// const readFromS3 = require("./utils/readFromS3");
// const saveToFile = require("../utils/saveToFile");
// const saveToS3 = require("../utils/saveToS3");

// const sendExpoNotification = require("./utils/expoNotifications");
const JARVIS = require("./core.js");

// active endpoints
const nasa = require("./endpoints/nasa");
const twitter = require("./endpoints/twitter");
const dribbble = require("./endpoints/dribbble");

const jrvs = new JARVIS({
  port: process.env.PORT || 4000
});

jrvs.start();

const unsecuredEndpoints = ["twitter", "nasa", "dribbble", "supercars"];

jrvs.app.listen(err => {
  if (err) console.error(err);
  const hours = n => n * 60 * 60 * 1000;

  nasa.fetchPhotoOfTheDay().then(data => console.log(data));
  dribbble.fetchLatestShots().then(data => console.log(data));
  twitter.fetchLatestTweets().then(data => console.log(data));

  // const cacheNasa = async () => {
  //   await nasa.fetchPhotoOfTheDay();
  //   setTimeout(cacheNasa, hours(24));
  // };

  // const cacheSupercars = async () => {
  //   await supercars();
  //   setTimeout(cacheSupercars, hours(24));
  // };

  // const cacheTwitter = async () => {
  //   await twitter.fetchLatestTweets();
  //   setTimeout(cacheTwitter, hours(1));
  // };

  // const cacheDribbble = async () => {
  //   await dribbble.fetchLatestShots();
  //   setTimeout(cacheDribbble, hours(24));
  // };

  if (process.env.CACHE_DATA === "true") {
    console.log("> starting caching");
    // cacheNasa();
    // cacheSupercars();
    // cacheTwitter();
    // cacheDribbble();
  }
});
