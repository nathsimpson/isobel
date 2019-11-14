const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const CFonts = require("cfonts");
const { ApolloServer, gql } = require("apollo-server-express");

const port = process.env.PORT || 4000;

dotenv.load();

const cacheEndpoint = async (service, cache) => {
  const { name, func, params } = service;
  await func(params)
    .then(data => cache.save(name, data))
    .catch(err => console.log(`❌ ERROR caching ${name} -`, err.message));
};

const startCaching = (service, cache) => {
  cacheEndpoint(service, cache);
  setInterval(() => cacheEndpoint(service, cache), service.interval);
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
      config: { cache, services, security }
    } = this;

    const typeDefs = gql`
      type Tweet {
        id: ID!
        text: String
        place: String
        image: String
      }

      type DribbbleShot {
        description: String
        image: String
        link: String
      }

      type YouTubeProfile {
        viewCount: String
        commentCount: String
        subscriberCount: String
        hiddenSubscriberCount: Boolean
        videoCount: String
      }

      type GitHubRepository {
        id: ID!
        name: String
        url: String
      }

      type GitHubRepositories {
        nodes: [GitHubRepository]
      }

      type Github {
        login: String
        name: String
        bio: String
        company: String
        email: String
        id: ID!
        location: String
        repositories: GitHubRepositories
      }

      type Query {
        tweets: [Tweet]
        github: Github
        dribbbleShots: [DribbbleShot]
        youTubeProfile: YouTubeProfile
      }
    `;

    const resolvers = {
      Query: {
        tweets: () => cache.read("twitter"),
        github: () => cache.read("github"),
        dribbbleShots: () => cache.read("dribbble"),
        youTubeProfile: () => cache.read("youtube")
      }
    };

    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers
    });

    apolloServer.applyMiddleware({ app }); // app is from an existing express app

    // CFonts.say("ISOBEL", {
    //   font: "3d", // define the font face
    //   align: "left", // define text alignment
    //   colors: ["yellow", "cyan"] // define all colors
    // });

    console.log(`🐶 ISOBEL listening on port ${port}.`);
    console.log(
      `🚀 GraphQL is ready at http://localhost:4000${apolloServer.graphqlPath}`
    );

    return new Promise((resolve, reject) => {
      app.get("/", (req, res) => {
        res.status(404).end();
      });

      app.get("/welcome", (req, res) => res.send("Hello. My name is ISOBEL"));

      app.get("/get/:service/", async (req, res) => {
        const { service } = req.params;
        const requestIp = req.headers["x-forwarded-for"];

        if (!service) return res.status(404).end();

        if (
          requestIp &&
          security &&
          security.allowedIPs &&
          security.allowedIPs.indexOf(requestIp) === -1
        ) {
          return res.status(403).end();
        }

        return res.json(await cache.read(service));
      });

      app.listen(port, error => {
        console.log("⚙️ Starting caching");
        if (error) return reject(error);
        services.forEach(service => startCaching(service, cache));

        return resolve({ port });
      });
    });
  }
};
