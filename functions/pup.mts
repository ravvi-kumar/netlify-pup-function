import chromium from '@sparticuz/chromium';
import puppeteer from "puppeteer-core"
import cheerio from "cheerio"

import type { Context } from "@netlify/functions"


export default async (req: Request, context: Context) => {
    const result = await runPuppeteer();
    return new Response(`Hello, world! ${result}`)
    // return new Response(`Hello, world!`)
}

async function runPuppeteer() {
    const url = 'https://kami4ka.github.io/dynamic-website-example/';

    try {
        // Launch a browser
        const browser = await puppeteer.launch({
            args: chromium.args,
            executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath(),
            headless: chromium.headless,
        });

        const page = await browser.newPage();
        await page.goto(url);

        const html = await page.content();

        const $ = cheerio.load(html);

        const pageText = $('div').text();

        console.log(pageText)

        // Close everything
        page.close();
        await browser.close();
        return pageText;

    } catch (error: any) {
        console.log(error);
        return error
    }
}