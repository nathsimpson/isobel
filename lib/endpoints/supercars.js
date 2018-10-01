const puppeteer = require('puppeteer');

import saveToFile from '../utils/saveToFile';
//import saveToS3 from '../utils/saveToS3';

let links = "";

async function getLinks() {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto('https://supercars.com');
      await page.screenshot({ path: 'example.png' });
      links = await page.evaluate(() => document.querySelectorAll('a').textContent);
      await console.log(links);
      await browser.close();
};

const supercars = async (req, res) => {
      console.log('> requesting supercars');

      getLinks();

      //if (process.env.SAVE_OFFLINE === 'true') saveToFile('calendar', results);
      //if (process.env.SAVE_ONLINE === 'true') saveToS3('calendar', results);

      //if (res) res.json(links);
      return true;
};

export default supercars;