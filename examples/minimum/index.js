const ISOBEL = require("@isobel/core");
const fileSystem = require("@isobel/file-system");
const nasa = require("@isobel/nasa");

const hours = n => n * 60 * 60 * 1000;

// initialise
const Isobel = new ISOBEL({
  port: 3000,
  cache: fileSystem,
  endpoints: [
    {
      name: "nasa",
      func: nasa.fetchPhotoOfTheDay,
      interval: hours(24)
    }
  ]
});

Isobel.start();

Isobel.app.listen(err => {
  if (err) console.error(err);
  console.log("⚙️ Starting caching");
});
