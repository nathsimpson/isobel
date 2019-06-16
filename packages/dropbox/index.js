const fetch = require("isomorphic-fetch");
const Dropbox = require("dropbox").Dropbox;
const dbx = new Dropbox({
  accessToken: process.env.DROPBOX_ACCESS_TOKEN,
  fetch
});

exports.save = async (endpoint, data) =>
  new Promise((resolve, reject) => {
    dbx
      .filesUpload({
        path: `/${endpoint}.json`,
        contents: JSON.stringify(data)
      })
      .then(response => {
        console.log(`✅ saved ${endpoint} to Dropbox`);
        return resolve();
      })
      .catch(err => {
        console.log("error", err);
        return reject({ message: err.response.data });
      });
  });

exports.read = async endpoint =>
  new Promise(resolve => {
    dbx
      .filesDownload({ path: `/${endpoint}.json` })
      .then(response => {
        return resolve(JSON.parse(response.fileBinary.toString("utf8")));
      })
      .catch(err => {
        throw err;
      });
  });
