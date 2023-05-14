import { Module } from '@nestjs/common';
import { TruelayerController } from './truelayer.controller';
import { TruelayerService } from './truelayer.service';
import { ZkModule } from '../zk/zk.module';

@Module({
  imports: [ZkModule],
  controllers: [TruelayerController],
  providers: [TruelayerService],
})
export class TruelayerModule {}
