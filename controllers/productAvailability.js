const { body } = require("express-validator");
const puppeteer = require("puppeteer");
const notify = require("../services/twilio");

module.exports.validationRules = [
  body("name").notEmpty().isString(),
  body("url").isURL(),
  body("selector").notEmpty().isString(),
  body("innerText").optional().isString().notEmpty(),
];

module.exports.productAvailabilityController = async (req, res) => {
  const { name, url, selector, innerText } = req.body;
  const browser = await puppeteer.launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--ignore-certificate-errors",
      "--disable-infobars",
      "--window-position=0,0",
      "--ignore-certifcate-errors-spki-list",
      "--disable-web-security",
    ],
    ignoreHTTPSErrors: true,
    headless: true,
    devtools: false,
  });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4298.0 Safari/537.36"
  );
  await page.setExtraHTTPHeaders({
    "accept-language": "en-US,en;q=0.9",
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  });

  await page.goto(url);
  await page.waitForSelector(selector);
  const matchedElements = await page.$$(selector);
  console.log("Number of Matched Elements", matchedElements.length);
  const matchedElementInnerTexts = await Promise.all(
    matchedElements.map(
      async (elementHandle) =>
        await elementHandle.evaluate((node) => node.innerText)
    )
  );
  console.log("Matched Elements", matchedElementInnerTexts);
  await browser.close();

  let productIsAvailable = false;
  if (!innerText) {
    if (matchedElements.length === 1) {
      productIsAvailable = true;
    }
  } else {
    if (
      matchedElementInnerTexts.some(
        (str) => String(str).toLowerCase() === innerText.toLowerCase()
      )
    ) {
      productIsAvailable = true;
    }
  }

  const message = `${name} is ${
    productIsAvailable ? "available" : "not available"
  }`.toUpperCase();

  console.log("Message", message);

  if (productIsAvailable) {
    await notify(message);
  }
  return res.status(200).send({
    productIsAvailable,
    message: message,
  });
};
