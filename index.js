const JARVIS = require("./core.js");

// utils
const fileSystem = require("./utils/fileSystem");
const S3 = require("./utils/S3");
// const sendExpoNotification = require("./utils/expoNotifications");

// endpoints
const nasa = require("./endpoints/nasa");
const twitter = require("./endpoints/twitter");
const dribbble = require("./endpoints/dribbble");

// initialise
const jrvs = new JARVIS({
  port: process.env.PORT || 4000
});

jrvs.start();

const cache = (endpoint, data) => fileSystem.saveFile(endpoint, data);

jrvs.app.listen(err => {
  if (err) console.error(err);
  const hours = n => n * 60 * 60 * 1000;

  const cacheNasa = async () => {
    await nasa.fetchPhotoOfTheDay().then(data => cache("nasa", data));
    setTimeout(cacheNasa, hours(24));
  };

  const cacheTwitter = async () => {
    await twitter.fetchLatestTweets().then(data => cache("twitter", data));
    setTimeout(cacheTwitter, hours(1));
  };

  const cacheDribbble = async () => {
    await dribbble.fetchLatestShots().then(data => cache("dribbble", data));
    setTimeout(cacheDribbble, hours(24));
  };

  console.log("> starting caching");
  cacheNasa();
  cacheTwitter();
  cacheDribbble();
});
