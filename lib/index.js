import "babel-polyfill";

const port = process.env.PORT || 4000;

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require("express");
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import readFromFile from "./utils/readFromFile";

import nasa from "./endpoints/nasa";
import supercars from "./endpoints/supercars";
import twitter from "./endpoints/twitter";

const unsecuredEndpoints = ["twitter"];

dotenv.load();
const app = express();

app.use(cors());
app.use(morgan("tiny"));

app.get("/", (req, res) => res.status(404).end());

app.get("/welcome", (req, res) => {
  //return res.json({"name": "nathan"});
  return res.send("Hello. My name is JARVIS");
});

app.get("/read/:endpoint/", async (req, res) => {
  const { endpoint } = req.params;
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

  if (!endpoint) return res.status(404).end();
  //return res.json(endpoint).end();
  return res.json(await readFromFile(endpoint));
  //if (type === 'remote') return res.json(await readFromS3(endpoint));
  //return res.status(404).end();
});

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

  if (process.env.CACHE_DATA === "true") {
    console.log("> starting caching");
    cacheNasa();
    //cacheSupercars();
    cacheTwitter();
  }
});
