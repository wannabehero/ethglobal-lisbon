import { Controller, Get, HttpException, Logger, Query, Redirect } from '@nestjs/common';
import { TruelayerService } from './truelayer.service';
import { ZkService } from '../zk/zk.service';

@Controller('truelayer')
export class TruelayerController {
  private readonly logger = new Logger(TruelayerController.name);

  constructor(private readonly svc: TruelayerService, private readonly zk: ZkService) {}

  @Get('/auth')
  @Redirect()
  async initAuth() {
    const url = this.svc.getAuthUrl();
    return {
      url,
      statusCode: 302,
    };
  }

  @Get('/callback')
  async callback(@Query('code') code: string) {
    const accessToken = await this.svc.getAccessToken(code);
    const totalBalance = await this.svc.getTotalBalance(accessToken);
    this.logger.log(`Total balance: ${totalBalance}`);

    const target = 200;

    try {
      const proof = await this.zk.generateProof(
        '0xE432a8314d971441Ad7700e8b45d66cC326CE517',
        totalBalance,
        target,
      );
      return proof;
    } catch (err) {
      this.logger.error(err);
      throw new HttpException(`Invalid proof: ${totalBalance} >= ${target} `, 400);
    }
  }
}
