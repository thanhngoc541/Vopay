import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom, catchError } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) { }
  getHello(): string {
    return 'Hello World!';
  }
  getSignature() {
    var crypto = require('crypto')
    var shasum = crypto.createHash('sha1')

    var key = process.env.API_KEY
    var secret = process.env.SECRET
    let date = new Date();

    var dateString = date.toISOString().split('T')[0]

    shasum.update(key + secret + dateString)
    var signature = shasum.digest('hex')
    console.log("signature: ", signature);
    return signature;
  }
  async authPing() {
    const form = new FormData();
    form.append('AccountID', process.env.ACCOUNT_ID);
    form.append('Key', process.env.API_KEY);
    form.append('Signature', this.getSignature());
    const { data } = await firstValueFrom(
      this.httpService
        .post('https://earthnode-dev.vopay.com/api/v2/auth/ping',
          form
        ).pipe(
          catchError((error: AxiosError) => {
            throw 'An error happened!';
          }),
        ),
    );
    return data;
  }
  async getAccountBalance() {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`https://earthnode-dev.vopay.com/api/v2/account/balance?AccountID=${process.env.ACCOUNT_ID}&Key=${process.env.API_KEY}&Signature=${this.getSignature()}`
        ).pipe(
          catchError((error: AxiosError) => {
            throw 'An error happened!';
          }),
        ),
    );
    return data;
  }

  async getAccountTransactions(body) {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`https://earthnode-dev.vopay.com/api/v2/account/transactions?AccountID=${process.env.ACCOUNT_ID}&Key=${process.env.API_KEY}&Signature=${this.getSignature()}&StartDateTime=${body.startDate}&EndDateTime=${body.endDate}`
        ).pipe(
          catchError((error: AxiosError) => {
            throw 'An error happened!';
          }),
        ),
    );
    return data;
  }
  async setSenderEmail(body) {
    const form = new FormData();
    form.append('AccountID', process.env.ACCOUNT_ID);
    form.append('Key', process.env.API_KEY);
    form.append('Signature', this.getSignature());
    form.append('SenderEmailAddress', body.email);
    const { data } = await firstValueFrom(
      this.httpService
        .post('https://earthnode-dev.vopay.com/api/v2/paylink/settings/setup-sender-email',
          form
        ).pipe(
          catchError((error: AxiosError) => {
            throw 'An error happened!';
          }),
        ),
    );
    return data;
  }
  async createPayLink(body) {
    const form = new FormData();
    form.append('AccountID', process.env.ACCOUNT_ID);
    form.append('Key', process.env.API_KEY);
    form.append('Signature', this.getSignature());
    form.append('SenderName', body.senderName);
    form.append('ReceiverName', body.receiverName);
    form.append('PaymentType', body.paymentType);
    form.append('Amount', body.amount);
    form.append('ReceiverEmailAddress', body.receiverEmailAddress);
    form.append('SendEmail', "true");
    const { data } = await firstValueFrom(
      this.httpService
        .post('https://earthnode-dev.vopay.com/api/v2/paylink',
          form
        ).pipe(
          catchError((error: AxiosError) => {
            throw 'An error happened!';
          }),
        ),
    );
    return data;
  }
}
