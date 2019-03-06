const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

dotenv.load();

// const readFromFile = require("./utils/readFromFile");
// const readFromS3 = require("./utils/readFromS3");

// const sendExpoNotification = require("./utils/expoNotifications");

// active endpoints
const nasa = require("./endpoints/nasa");
// const supercars = require("./endpoints/supercars");
const twitter = require("./endpoints/twitter");
const dribbble = require("./endpoints/dribbble");

const port = process.env.PORT || 4000;

// const jrvs = new JARVIS({
//   port: process.env.PORT || 4000
// });
// jrvs.start

const jrvs = express();

jrvs.use(cors());
jrvs.use(morgan("tiny"));
jrvs.use(bodyParser.json()); // support json encoded bodies
jrvs.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const unsecuredEndpoints = ["twitter", "nasa", "dribbble", "supercars"];

jrvs.get("/", (req, res) => {
  // sendExpoNotification("JARVIS ROOT ACCESS DENIED");
  res.status(404).end();
});

jrvs.get("/welcome", (req, res) => {
  return res.send("Hello. My name is JARVIS");
});

jrvs.get("/read/:type/:endpoint/", async (req, res) => {
  const { type, endpoint } = req.params;
  console.log(`> request endpoint ${endpoint}`);

  const requestIp = req.headers["x-forwarded-for"];
  const allowedIps = ["203.111.27.70", "122.106.16.97", "58.108.165.238"];

  if (
    requestIp &&
    allowedIps.indexOf(requestIp) === -1 &&
    unsecuredEndpoints.indexOf(endpoint) === -1
  ) {
    return res.status(403).end();
  }

  if (!type || !endpoint) return res.status(404).end();
  if (type === "local") return res.json(await readFromFile(endpoint));
  if (type === "remote") return res.json(await readFromS3(endpoint));
  return res.status(404).end();
});

jrvs.listen(port, err => {
  if (err) console.error(err);

  console.log(`JARVIS-API listening on port ${port}.`);
  const hours = n => n * 60 * 60 * 1000;

  nasa.fetchPhotoOfTheDay().then(data => console.log(data));
  dribbble.fetchLatestShots().then(data => console.log(data));
  twitter.fetchLatestTweets().then(data => console.log(data));

  // const cacheNasa = async () => {
  //   await nasa();
  //   setTimeout(cacheNasa, hours(24));
  // };

  // const cacheSupercars = async () => {
  //   await supercars();
  //   setTimeout(cacheSupercars, hours(24));
  // };

  // const cacheTwitter = async () => {
  //   await twitter();
  //   setTimeout(cacheTwitter, hours(1));
  // };

  // const cacheDribbble = async () => {
  //   await dribbble();
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
