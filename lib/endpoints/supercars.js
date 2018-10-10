const puppeteer = require("puppeteer");

import saveToFile from "../utils/saveToFile";
//import saveToS3 from '../utils/saveToS3';

async function getTop10() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://supercars.com");

  const top10 = [];

  const pageData = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".leaderboard-table-item"))
  );
  //.then(pageData.forEach(driver => console.log(driver.children)));

  //   await pageData.forEach(driver => {
  //     console.log(driver.children);
  //     const name = await driver.children[1].getElementsByClassName("leaderboard-table-item-driver")[0].textContent;
  //     const points = await driver.children[1].getElementsByClassName("leaderboard-table-item-points")[0].textContent;
  //     await top10.push({ name: name, points: points });
  //   });

  pageData.forEach(driver => {
    console.log(driver.children);
    const name = driver.children[1].getElementsByClassName(
      "leaderboard-table-item-driver"
    )[0].textContent;
    const points = driver.children[1].getElementsByClassName(
      "leaderboard-table-item-points"
    )[0].textContent;
    top10.push({ name: name, points: points });
  });

  return top10;

  await browser.close();
}

const supercars = async (req, res) => {
  console.log("> requesting supercars");

  let top10 = getTop10();
  let json = await { top10: top10 };
  console.log(json);

  if (process.env.SAVE_OFFLINE === "true") await saveToFile("supercars", json);
  //if (process.env.SAVE_ONLINE === 'true') saveToS3('calendar', results);
  //if (res) res.json(links);
};

export default supercars;
