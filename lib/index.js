import "babel-polyfill";

import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import Expo from 'expo-server-sdk';

import readFromFile from "./utils/readFromFile";
import readFromS3 from "./utils/readFromS3";
import nasa from "./endpoints/nasa";
import supercars from "./endpoints/supercars";
import twitter from "./endpoints/twitter";
import dribbble from "./endpoints/dribbble";

dotenv.load();

const app = express();
const port = process.env.PORT || 4000;
const bodyParser = require('body-parser');
const expo = new Expo();
const unsecuredEndpoints = ["twitter", "nasa", "dribbble"];

app.use(cors());
app.use(morgan("tiny"));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get("/", (req, res) => {

  try {
    expo.sendPushNotificationsAsync({
      to: process.env.EXPO_NOTIFICATION_KEY,
      sound: 'default',
      body: 'JARVIS ROOT ACCESS DENIED',
      data: { withSome: 'data' },
    })
  } catch (error) {
    console.error(error);
  }

  res.status(404).end()
});

app.get("/welcome", (req, res) => {
  return res.send("Hello. My name is JARVIS");
});

app.get("/read/:type/:endpoint/", async (req, res) => {
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


app.get("/notifications", (req, res) => res.status(404).end());

app.post('/notifications', function (req, res) {

  if(req.body.token == process.env.JRVS_ACCESS_TOKEN){

    try {
      expo.sendPushNotificationsAsync({
        to: process.env.EXPO_NOTIFICATION_KEY,
        sound: 'default',
        body: req.body.message,
        data: { withSome: 'data' },
      })
    } catch (error) {
      console.error(error);
    }
  
    res.send('NOTIFICATION SENT');

  }else{
    res.send('404 NOT FOUND');
  }
})

app.listen(port, err => {
  if (err) console.error(err);

  console.log(`JARVIS-API listening on port ${port}.`);

  const INSTANT_CACHE_PERIOD = 10 * 1000; // 10 seconds
  const SHORT_CACHE_PERIOD = 5 * 60 * 1000; // 5 minutes
  const LONG_CACHE_PERIOD = 60 * 60 * 1000; // 1 hour

  const cacheNasa = async () => {
    await nasa();
    setTimeout(cacheNasa, LONG_CACHE_PERIOD);
  };

  const cacheSupercars = async () => {
    await supercars();
    setTimeout(cacheSupercars, LONG_CACHE_PERIOD);
  };

  const cacheTwitter = async () => {
    await twitter();
    setTimeout(cacheTwitter, LONG_CACHE_PERIOD);
  };

  const cacheDribbble = async () => {
    await dribbble();
    setTimeout(cacheDribbble, LONG_CACHE_PERIOD);
  };

  if (process.env.CACHE_DATA === "true") {
    console.log("> starting caching");
    cacheNasa();
    //cacheSupercars();
    cacheTwitter();
    cacheDribbble();
  }
});
