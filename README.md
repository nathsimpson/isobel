# ISOBEL 🐶

Welcome!
Isobel is beginner-friendly NODE.js framework for caching data in API responses, so it can be used on your website.

Services are API endpoints that Jarvis will request from. A great example is Twitter, which gets the latest posrts from your Twitter feed. Isobel includes a bunch of premade services, but you can also create your own.

Here is a minumum implementation of Isobel.

```javascript
const ISOBEL = require("@isobel/core");
const fileSystem = require("@isobel/file-system");

// services
const nasa = require("@isobel/nasa");
const twitter = require("@isobel/twitter");
const dribbble = require("@isobel/dribbble");

const hours = n => n * 60 * 60 * 1000;

// initialise Isobel
const Isobel = new ISOBEL({
  port: 3000, // what port the process will run on your machine
  cache: fileSystem, // where the data will be stored
  endpoints: [
    // a list of all the services that will be requested from.
    {
      name: "nasa", // name of the file that will be created
      func: nasa.fetchPhotoOfTheDay, // the function that will return the data
      interval: hours(24) // how often the data will be fetched
    }
  ]
});

Isobel.start();

Isobel.app.listen(err => {
  if (err) console.error(err);
  console.log("⚙️ Starting caching");
});
```
