# ISOBEL 🐶

[![CircleCI](https://circleci.com/gh/nathsimpson/isobel.svg?style=svg)](https://circleci.com/gh/nathsimpson/isobel)

<span style="font-size: 1.5em;">
Welcome!
Isobel is a beginner friendly NodeJS framework for fetching data from your social profiles and other sources, for display in your own apps and websites. Isobel periodically fetches data from the services that you teach her, so the data is always there when you need it.
</span>

A great example is Twitter, which gets the latest posts from your Twitter feed. Once configured, you can access the JSON for your latest tweets at a defined URL, so you can display them on your website. That means no worrying about API rate-limiting or quotas, and no making API calls from your frontend (a big no-no).

Isobel includes a bunch of premade services, but you can also create your own.

Here is a minimum implementation of Isobel.

```javascript
const ISOBEL = require("@isobel/core");
const fileSystem = require("@isobel/file-system");
const nasa = require("@isobel/nasa");

const hours = n => n * 60 * 60 * 1000;

// initialise
const Isobel = new ISOBEL({
  cache: fileSystem,
  services: [
    {
      name: "nasa",
      func: nasa.fetchPhotoOfTheDay, // gets the NASA photo of the day
      interval: hours(24)
    }
  ]
});

Isobel.start().catch(error => {
  console.error("Error:", error);
  process.exit(1);
});
```

Ready to go? head to the [Getting Started guide](https://isobeljs.com/guides-getting-started) to...well...get started!

## Supported services

Isobel supports many services out of the box, here is the full list

### Dribbble

Retrieves your latest shots from Dribbble

### GitHub

Retrives profile information from GitHub

### NASA

Retrives the NASA photo of the day. Treat this one as an example for you to create your own services!

### Twitter

Retrives your latest tweets!

### YouTube

Retrives information about your YouTube Channel

## Supported caching strategies

Isobel currently supports three caching strategies, with more on the way!

- local file system
- Dropbox
- Amazon S3 Buckets

## Acknowledgements

Isobel is created by [Nathan Simpson](https://nathansimpson.design). Thank you to Thomas Walker for your inspiration, support and friendship.
