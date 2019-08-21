const ISOBEL = require("@isobel/core");
const fileSystem = require("@isobel/file-system");
const nasa = require("@isobel/nasa");
const toMs = require("to-ms");

// initialise
const Isobel = new ISOBEL({
  cache: fileSystem,
  services: [
    {
      name: "nasa",
      func: nasa.fetchPhotoOfTheDay,
      interval: toMs.hours(24)
    }
  ],
  security: {
    allowedIPs: ["127.0.0.1"] // only serve requests from these IP addresses
  }
});

Isobel.start().catch(error => {
  console.error("Error:", error);
  process.exit(1);
});
