const fs = require("fs");
const path = require("path");

exports.saveFile = async (endpoint, data) =>
  new Promise(resolve => {
    const filePath = path.join(__dirname, `/../cache/${endpoint}.json`);

    console.log(filePath);
    fs.writeFileSync(filePath, JSON.stringify(data));
    console.log(`> saved ${endpoint} to file`);
    return resolve();
  });

exports.readFile = async endpoint =>
  new Promise(resolve => {
    const filePath = path.join(__dirname, `/../cache/${endpoint}.json`);
    return resolve(JSON.parse(fs.readFileSync(filePath, "utf-8")));
  });
