const fs = require("fs");
const path = require("path");

exports.save = async (endpoint, data) =>
  new Promise(resolve => {
    const filePath = path.join(__dirname, `/../../cache/${endpoint}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data));
    console.log(`✅ saved ${endpoint} to file`);
    return resolve();
  });

exports.read = async endpoint =>
  new Promise(resolve => {
    const filePath = path.join(__dirname, `/../../cache/${endpoint}.json`);
    return resolve(JSON.parse(fs.readFileSync(filePath, "utf-8")));
  });
