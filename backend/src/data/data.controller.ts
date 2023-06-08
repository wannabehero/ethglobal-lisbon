import { Controller, Get } from '@nestjs/common';
import { DataService } from './data.service';

@Controller('data')
export class DataController {
  constructor(private readonly svc: DataService) {}

  @Get('/eth-global-tx-senders')
  async getETHGlobalTxSenders() {
    const senders = await this.svc.getETHGlobalTxSenders();
    return senders.reduce((acc, sender) => {
      acc[sender] = '1';
      return acc;
    }, {});
  }
}
