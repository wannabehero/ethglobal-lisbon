import { Body, Post, Controller, HttpException } from '@nestjs/common';
import { ZkService } from './zk.service';

@Controller('zk')
export class ZkController {
  constructor(private readonly svc: ZkService) {}

  @Post('/generate-test-income-proof')
  async generateTestIncomeProof(
    @Body() body: { account: string; income: number; target: number },
  ): Promise<object> {
    const { account, income, target } = body;
    return this.svc
      .generateProof(account, income, target)
      .then((data) => ({ proof: data }))
      .catch(() => {
        throw new HttpException('Invalid proof', 400);
      });
  }
}
