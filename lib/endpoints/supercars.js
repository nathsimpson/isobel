const puppeteer = require('puppeteer');

import saveToFile from '../utils/saveToFile';
//import saveToS3 from '../utils/saveToS3';

async function getTop10() {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto('https://supercars.com');

      const top10 = await page.evaluate(() =>
            Array.from(document.querySelectorAll('.leaderboard-table-item-driver'))
                  .map(driver => driver.textContent)
                  .splice(0, 10)
      );

      return await top10

      await browser.close();
};


const supercars = async (req, res) => {

      console.log('> requesting supercars');

      let top10 = await getTop10();
      let json = await {'top10' : top10}
      console.log(json);
      
      if (process.env.SAVE_OFFLINE === 'true') await saveToFile('supercars', json);
      //if (process.env.SAVE_ONLINE === 'true') saveToS3('calendar', results);
      //if (res) res.json(links);
};

export default supercars;