const puppeteer = require("puppeteer");

import saveToFile from "../utils/saveToFile";
import saveToS3 from "../utils/saveToS3";

const getTop10 = new Promise(async (resolve, reject) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://supercars.com");

  const data = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".leaderboard-table-item")).map(
      driver => ({
        title: driver.querySelector(".leaderboard-table-item-driver")
          .textContent,
        points: parseInt(
          driver
            .querySelector(".leaderboard-table-item-points")
            .textContent.trim()
            .replace(" pts", "")
        )
      })
    )
  );
  await resolve(data);
});

const supercars = async () => {
  console.log("> requesting supercars");

  getTop10
    .then(data => {
      if (process.env.SAVE_OFFLINE === "true") {
        saveToFile("supercars", data);
      }
      if (process.env.SAVE_ONLINE === "true") {
        saveToS3("supercars", data);
      }
    })
    .catch(err => console.log(err));
};

export default supercars;
