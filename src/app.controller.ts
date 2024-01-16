import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private readonly httpService: HttpService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get("signature")
  getSignature() {
    return { accountId: process.env.ACCOUNT_ID, key: process.env.API_KEY, signature: this.appService.getSignature() };
  }

  @Get("auth/ping")
  authPing() {
    return this.appService.authPing();
  }

  @Get("account/balance")
  getAccountBalance() {
    return this.appService.getAccountBalance();
  }

  @Post("settings/setup-sender-email")
  setEmailSender(@Body() body: any) {
    return this.appService.setSenderEmail(body)
  }

  @Post("paylink")
  createPaylink(@Body() body: any) {
    return this.appService.createPayLink(body);
  }
  @Post("eft/fund")
  eftFund(@Body() body: any) {
    return this.appService.eftFund(body);
  }
  @Post("account/transactions")
  getAccountTransactions(@Body() body: any) {
    return this.appService.getAccountTransactions(body);
  }
}
