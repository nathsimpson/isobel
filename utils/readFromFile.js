import fs from "fs";
import path from "path";

const readFromFile = async endpoint =>
  new Promise(resolve => {
    const filePath = path.join(__dirname, `/../cache/${endpoint}.json`);
    return resolve(JSON.parse(fs.readFileSync(filePath, "utf-8")));
  });

export default readFromFile;
