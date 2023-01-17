const puppeteer = require('puppeteer');
const fs = require('fs');


(async () => {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    const html = fs.readFileSync('form.html', 'utf-8');
    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    await page.emulateMediaType('screen');

    const pdf = await page.pdf(
        {
            path: 'results.pdf',
            margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' }, 
            printBackground: true,
            format: 'A4'
        });

    await browser.close();

})();
