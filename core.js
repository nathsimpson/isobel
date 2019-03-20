const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const port = process.env.PORT || 4000;

dotenv.load();

module.exports = class JARVIS {
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
      config: { port }
    } = this;

    console.log(`JARVIS-API listening on port ${port}.`);

    return new Promise((resolve, reject) => {
      app.get("/", (req, res) => {
        // sendExpoNotification("JARVIS ROOT ACCESS DENIED");
        res.status(404).end();
      });

      app.get("/welcome", (req, res) => res.send("Hello. My name is JARVIS"));

      app.get("/:endpoint/", async (req, res) => {
        const { endpoint } = req.params;
        console.log(`> request endpoint ${endpoint}`);

        const requestIp = req.headers["x-forwarded-for"];
        if (requestIp && unsecuredEndpoints.indexOf(endpoint) === -1) {
          return res.status(403).end();
        }

        if (!endpoint) return res.status(404).end();
        return res.json(await readFromS3(endpoint));
      });

      app.get("/:endpoint/local", async (req, res) => {
        const { type, endpoint } = req.params;
        console.log(`> request endpoint ${endpoint}`);

        const requestIp = req.headers["x-forwarded-for"];

        if (requestIp && unsecuredEndpoints.indexOf(endpoint) === -1) {
          return res.status(403).end();
        }

        if (!endpoint) return res.status(404).end();

        return res.json(await readFromFile(endpoint));
      });

      app.listen(port, error => {
        if (error) {
          return reject(error);
        }
        return resolve({ port });
      });
    });
  }
};
