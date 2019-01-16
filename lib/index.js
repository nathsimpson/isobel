import "babel-polyfill";

import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import readFromFile from "./utils/readFromFile";
import readFromS3 from "./utils/readFromS3";
import sendExpoNotification from "./utils/expoNotifications";

import nasa from "./endpoints/nasa";
import supercars from "./endpoints/supercars";
import twitter from "./endpoints/twitter";
import dribbble from "./endpoints/dribbble";

dotenv.load();

const app = express();
const port = process.env.PORT || 4000;
const unsecuredEndpoints = ["twitter", "nasa", "dribbble", "supercars"];

app.use(cors());
app.use(morgan("tiny"));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get("/", (req, res) => {
  sendExpoNotification("JARVIS ROOT ACCESS DENIED");
  res.status(404).end();
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

app.post("/notifications", function(req, res) {
  if (req.body.token == process.env.JRVS_ACCESS_TOKEN) {
    sendExpoNotification(req.body.message);
    res.send("NOTIFICATION SENT");
  } else {
    res.send("404 NOT FOUND");
  }
});

app.listen(port, err => {
  if (err) console.error(err);

  console.log(`JARVIS-API listening on port ${port}.`);
  const hours = n => n * 60 * 60 * 1000;

  const cacheNasa = async () => {
    await nasa();
    setTimeout(cacheNasa, hours(24));
  };

  const cacheSupercars = async () => {
    await supercars();
    setTimeout(cacheSupercars, hours(24));
  };

  const cacheTwitter = async () => {
    await twitter();
    setTimeout(cacheTwitter, hours(1));
  };

  const cacheDribbble = async () => {
    await dribbble();
    setTimeout(cacheDribbble, hours(24));
  };

  if (process.env.CACHE_DATA === "true") {
    console.log("> starting caching");
    // cacheNasa();
    // cacheSupercars();
    // cacheTwitter();
    cacheDribbble();
  }
});
