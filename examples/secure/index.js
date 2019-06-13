const ISOBEL = require("@isobel/core");
const fileSystem = require("@isobel/file-system");
const nasa = require("@isobel/nasa");

// initialise
const Isobel = new ISOBEL({
  cache: fileSystem,
  services: [
    {
      name: "nasa",
      func: nasa.fetchPhotoOfTheDay,
      interval: 24 * 60 * 60 * 1000
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
