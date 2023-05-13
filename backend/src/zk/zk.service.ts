import { Inject, Injectable, Logger } from '@nestjs/common';
import { CompilationArtifacts, ZoKratesProvider } from 'zokrates-js';
import { ARTIFACTS, PROVIDER } from './consts';

@Injectable()
export class ZkService {
  private readonly privateKey: Uint8Array;
  private readonly logger = new Logger(ZkService.name);

  constructor(
    @Inject(ARTIFACTS) private readonly artifacts: CompilationArtifacts,
    @Inject(PROVIDER) private readonly provider: ZoKratesProvider,
  ) {
    this.privateKey = this.provider.setup(this.artifacts.program).pk;
  }

  async generateProof(account: string, income: number, target: number): Promise<object> {
    this.logger.log(`Generating proof for ${account} with ${income} >= ${target}`);

    const { witness } = this.provider.computeWitness(this.artifacts, [
      income.toString(),
      target.toString(),
    ]);

    const { proof } = this.provider.generateProof(this.artifacts.program, witness, this.privateKey);
    return proof;
  }
}
