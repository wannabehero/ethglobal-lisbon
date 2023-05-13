import * as fs from 'fs';
import { Module } from '@nestjs/common';
import { initialize } from 'zokrates-js';
import { ZkService } from './zk.service';
import { ZkController } from './zk.controller';
import { ARTIFACTS, PROVIDER } from './consts';

@Module({
  providers: [
    {
      provide: ARTIFACTS,
      useFactory: () => {
        const contents = JSON.parse(fs.readFileSync('../chain/zk/program.json', 'utf8'));
        return {
          ...contents,
          program: Uint8Array.from(contents.program),
        };
      },
    },
    {
      provide: PROVIDER,
      useFactory: async () => initialize(),
    },
    ZkService,
  ],
  controllers: [ZkController],
  exports: [ZkService],
})
export class ZkModule {}
