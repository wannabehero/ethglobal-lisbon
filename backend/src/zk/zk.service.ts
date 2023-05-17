import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as snarkjs from 'snarkjs';

@Injectable()
export class ZkService {
  private readonly logger = new Logger(ZkService.name);

  constructor(private readonly config: ConfigService) {}

  async generateProof(account: string, income: number, target: number): Promise<string> {
    const payload = { income, target };
    const { proof, publicSignals } = await snarkjs.plonk.fullProve(
      payload,
      this.config.get('ZK_WASM_PATH') ?? '../chain/snarks/gte_js/gte.wasm',
      this.config.get('ZK_ZKEY_PATH') ?? '../chain/snarks/gte_plonk.zkey',
    );

    const calldata: string = await snarkjs.plonk.exportSolidityCallData(proof, publicSignals);

    const [, ...params] = calldata.match(/^(0x[\w]+),(\[.+\])$/);

    return params[0];
  }
}
