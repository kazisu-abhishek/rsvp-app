const puppeteer = require('puppeteer');
const fs = require('fs');
const { dirname } = require('path');


(async () => {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    const html = fs.readFileSync('form.html', 'utf-8');
    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    // Code to extract the filename a path dynamically
    const fileName = 'form';

    await page.emulateMediaType('screen');

    const pdf = await page.pdf(
        {
            path: __dirname + '/../../assets/pdf/' + `${fileName}` + '.pdf',
            margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' }, 
            printBackground: true,
            format: 'A4'
        });

    await browser.close();

})();
