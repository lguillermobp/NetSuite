const puppeteer = requiere('puppeteer');

async function scrapeProduct(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const [el] = await page.$x('//*[@id="content"]/div/section/div[1]/p/a');
    const src = await el.getProperty('src');
    const srcTxt = await src.JsonValue();

    console.log({srcTxt});
    browser.close();

}

scrapeProduct('https://www.python.org/downloads/')