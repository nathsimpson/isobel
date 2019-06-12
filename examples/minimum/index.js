const ISOBEL = require("@isobel/core");
const fileSystem = require("@isobel/file-system");
const nasa = require("@isobel/nasa");

// initialise
const Isobel = new ISOBEL({
  port: 3000,
  cache: fileSystem,
  endpoints: [
    {
      name: "nasa",
      func: nasa.fetchPhotoOfTheDay,
      interval: 24 * 60 * 60 * 1000;
    }
  ]
});

Isobel.start().catch(error => {
  console.error("Error:", error);
  process.exit(1);
});
