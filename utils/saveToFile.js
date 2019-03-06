import fs from 'fs';
import path from 'path';

const saveToFile = async (endpoint, data) => new Promise((resolve) => {
  const filePath = path.join(__dirname, `/../cache/${endpoint}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data));
  console.log(`> saved ${endpoint} to file`);
  return resolve();
});

export default saveToFile;