const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const CFonts = require("cfonts");
const port = process.env.PORT || 4000;

dotenv.load();

const cacheEndpoint = async (name, func, interval, cache) => {
  await func()
    .then(data => cache.save(name, data))
    .catch(err => console.log(`❌ ERROR caching ${name} -`, err.message));
};

const startCaching = (name, func, interval, cache) => {
  cacheEndpoint(name, func, interval, cache);
  setInterval(() => cacheEndpoint(name, func, interval, cache), interval);
};

module.exports = class ISOBEL {
  constructor(config) {
    this.express = express;
    this.app = express();
    this.app.use(cors());
    this.app.use(morgan("tiny"));
    this.app.use(bodyParser.json()); // support json encoded bodies
    this.app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
    this.config = config;
  }

  async start() {
    const {
      app,
      config: { port, cache, endpoints }
    } = this;

    CFonts.say("ISOBEL", {
      font: "3d", // define the font face
      align: "left", // define text alignment
      colors: ["yellow", "cyan"] // define all colors
    });

    console.log(`🐶 ISOBEL listening on port ${port}.`);

    return new Promise((resolve, reject) => {
      app.get("/", (req, res) => {
        // sendExpoNotification("ISOBEL ROOT ACCESS DENIED");
        res.status(404).end();
      });

      app.get("/welcome", (req, res) => res.send("Hello. My name is ISOBEL"));

      app.get("/:endpoint/", async (req, res) => {
        const { endpoint } = req.params;

        // const requestIp = req.headers["x-forwarded-for"];
        // if (requestIp && unsecuredEndpoints.indexOf(endpoint) === -1) {
        //   return res.status(403).end();
        // }

        if (!endpoint) return res.status(404).end();
        return res.json(await cache.read(endpoint));
      });

      app.listen(port, error => {
        if (error) return reject(error);

        endpoints.forEach(ep =>
          startCaching(ep.name, ep.func, ep.interval, cache)
        );

        return resolve({ port });
      });
    });
  }
};
