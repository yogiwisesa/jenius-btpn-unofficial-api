import { Request, Response } from 'express';
import puppeteer from 'puppeteer';

import { get, controller, post } from './decorators';

const options = {
  headless: true
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const LOGIN_URL = 'https://2secure.jenius.co.id/#/authentication/login';
const TRANSACTION_HISTORY_URL = 'https://2secure.jenius.co.id/#/inout/inout';
const CARD_CENTER_URL = 'https://2secure.jenius.co.id/#/cardcenter/manage-cards';
const SAVE_IT_URL = 'https://2secure.jenius.co.id/#/save-it/manage-savings';

let browser: any = null;
let page: any = null;

@controller('/jenius')
export default class JeniusController {
  @get('/save-it')
  async getSaveIt(req: Request, res: Response<DefaultResponse>): Promise<Response> {
    if (!page) {
      return res.status(401).send({
        code: 'UNAUTHORIZED',
        message: 'Please login first!',
        data: null
      });
    }

    let saveIt: any = null;

    page.on('response', async (response: any) => {
      // Ignore OPTIONS requests
      const request = response.request();
      const requestBody = request.postData();
      if (requestBody) {
        const includesQuery = JSON.stringify(requestBody).includes('saveIt');
        console.log(includesQuery);

        if (includesQuery) {
          saveIt = await response.json();
        }
      }
    });

    await page.goto(SAVE_IT_URL);

    while (!saveIt) {
      // eslint-disable-next-line no-await-in-loop
      await sleep(1000);
    }

    return res.send({
      code: 'ok',
      message: null,
      data: saveIt
    });
  }

  @get('/card-center')
  async getCardCenter(req: Request, res: Response<DefaultResponse>): Promise<Response> {
    if (!page) {
      return res.status(401).send({
        code: 'UNAUTHORIZED',
        message: 'Please login first!',
        data: null
      });
    }

    let cardCenter: any = null;

    page.on('response', async (response: any) => {
      // Ignore OPTIONS requests
      const request = response.request();
      const requestBody = request.postData();
      if (requestBody) {
        const includesQuery = JSON.stringify(requestBody).includes('cardListQuery');
        console.log(includesQuery);

        if (includesQuery) {
          cardCenter = await response.json();
        }
      }
    });

    await page.goto(CARD_CENTER_URL);

    while (!cardCenter) {
      // eslint-disable-next-line no-await-in-loop
      await sleep(1000);
    }

    return res.send({
      code: 'ok',
      message: null,
      data: cardCenter
    });
  }

  @get('/transaction')
  async getTransaction(req: Request, res: Response<DefaultResponse>): Promise<Response> {
    if (!page) {
      return res.status(401).send({
        code: 'UNAUTHORIZED',
        message: 'Please login first!',
        data: null
      });
    }

    let trx: any = null;

    page.on('response', async (response: any) => {
      // Ignore OPTIONS requests
      const request = response.request();
      const requestBody = request.postData();
      if (requestBody) {
        const includesQuery = JSON.stringify(requestBody).includes('inOutHistoryQuery');
        console.log(includesQuery);

        if (includesQuery) {
          trx = await response.json();
        }
      }
    });

    await page.goto(TRANSACTION_HISTORY_URL);

    while (!trx) {
      // eslint-disable-next-line no-await-in-loop
      await sleep(1000);
    }

    return res.send({
      code: 'ok',
      message: null,
      data: trx
    });
  }

  @post('/otp/:otpCode')
  async setOtp(req: Request, res: Response<DefaultResponse>): Promise<Response> {
    if (!page) {
      return res.status(401).send({
        code: 'UNAUTHORIZED',
        message: 'Please login first!',
        data: null
      });
    }
    const { otpCode } = req.params;

    const splitedOtp = otpCode.split('');

    for (let i = 0; i < splitedOtp.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await page.type(`input[aria-label=SingleInput_${i}]`, splitedOtp[i], {
        delay: 20
      });
    }

    await page.waitForSelector('[aria-label=Active_Widget_Header]');

    await page.click('[aria-label=Active_Widget_Header]');

    return res.send({
      code: 'ok',
      message: null,
      data: 'Auth success!'
    });
  }

  @post('/login')
  async loginJenius(req: Request, res: Response<DefaultResponse>): Promise<Response> {
    const { email, password } = req.body;

    if (!browser && !page) {
      browser = await puppeteer.launch(options);
      page = await browser.newPage();
    }

    await page.goto(LOGIN_URL);

    await page.waitForSelector('[name=email]');

    await page.type('input[name=email]', email, { delay: 20 });
    await page.type('input[name=password]', password, { delay: 20 });

    await page.click('[aria-label=Next_Button');

    // Reset Browser & Page
    page.on('response', async (response: any) => {
      // Ignore OPTIONS requests
      const request = response.request();
      const requestBody = request.postData();
      if (requestBody) {
        const includesQuery = JSON.stringify(requestBody).includes('loginPageResources');
        console.log(includesQuery);

        if (includesQuery) {
          console.log('LOGGED OUT!');
          await browser.close();
          browser = null;
          page = null;
        }
      }
    });

    return res.send({
      code: 'ok',
      message: null,
      data: 'OTP Sent'
    });
  }
}
