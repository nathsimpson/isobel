---
name: Getting Started
---

# Getting Started

Follow these steps to get your first Isobel up and running.

## Install Node

The first step is to [install NodeJS](https://nodesource.com/blog/installing-nodejs-tutorial-mac-os-x/) on your machine. Once you have followed the guide, type the following into your terminal to verify Node is installed.

```
node -v
```

This should return something like `v10.16.0` in the terminal.

## Initialise Isobel

Ok, let's get this party started. First, create a new folder on your desktop called 'myIsobelApp' (or whatever you like). Then, open your text editor (we like Visual Studio Code), and open the 'myIsobelApp' folder within it.

Create a `package.json` file, and copy this code into it.

```json
{
  "name": "my-isobel-app",
  "version": "1.0.0",
  "description": "Look ma, I'm on the internet!",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "author": "your name here"
}
```

Now. Let's install Isobel. Run the following snippit in your terminal to install

```
yarn add @isobel/core @isobel/file-system @isobel/nasa
```

Then, create an `index.js` file, and copy this code into it.

```javascript
// import the packages
const ISOBEL = require("@isobel/core");
const fileSystem = require("@isobel/file-system");
const nasa = require("@isobel/nasa");

// initialise
const Isobel = new ISOBEL({
  cache: fileSystem, // where the data will be saved and read from
  services: [
    {
      name: "nasa", // the name of the cache artifact for the URL
      func: nasa.fetchPhotoOfTheDay, // which function will be run
      interval: 24 * 60 * 60 * 1000 // how often the cache will be refreshed
    }
  ]
});

Isobel.start().catch(error => {
  console.error("Error:", error);
  process.exit(1);
});
```

Excellent! Running `yarn start` will now produce the following...

```
🐶 ISOBEL listening on port 4000.
⚙️ Starting caching
✅ saved nasa to file
```

Awesome! Now head to `localhost:4000/get/nasa` to see the results!

Congratulations, you are up and running.

## Next steps

Now that you've got Isobel going. Take a look at the [other services](https://isobeljs.com/#supported-services) that are available for use, or maybe you can create your own? Take a look at the [NASA service](https://github.com/nathsimpson/isobel/blob/master/packages/services/nasa/index.js) to see what goes into making one.
