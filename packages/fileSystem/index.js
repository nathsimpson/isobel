const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, `/../../../cache/`);

exports.save = async (endpoint, data) =>
  return new Promise(resolve => {
    const filePath = `${dir}/${endpoint}.json`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    fs.writeFileSync(filePath, JSON.stringify(data));
    console.log(`✅ saved ${endpoint} to file`);
    return resolve();
  });

exports.read = async endpoint =>
  new Promise(resolve => {
    const filePath = `${dir}/${endpoint}.json`;
    return resolve(JSON.parse(fs.readFileSync(filePath, "utf-8")));
  });
