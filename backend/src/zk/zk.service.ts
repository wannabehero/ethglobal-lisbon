import * as fs from 'fs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { CompilationArtifacts, SetupKeypair, ZoKratesProvider } from 'zokrates-js';
import { exec } from 'child_process';
import { ARTIFACTS, PROVIDER } from './consts';

@Injectable()
export class ZkService {
  private readonly keypair: SetupKeypair;
  private readonly logger = new Logger(ZkService.name);

  constructor(
    @Inject(ARTIFACTS) private readonly artifacts: CompilationArtifacts,
    @Inject(PROVIDER) private readonly provider: ZoKratesProvider,
  ) {
    this.keypair = this.provider.setup(this.artifacts.program);
  }

  private async zokratesCmd(cmd: string) {
    return new Promise((resolve, reject) => {
      exec(
        cmd,
        {
          cwd: '../chain/circuits',
        },
        (error, stdout, stderr) => {
          this.logger.log(stdout);
          this.logger.error(stderr);
          if (error) {
            reject(error);
          } else {
            resolve(0);
          }
        },
      );
    });
  }

  async generateProof(account: string, income: number, target: number): Promise<object> {
    await this.zokratesCmd(`zokrates compute-witness -o ${account} -a ${income} ${target}`);
    await this.zokratesCmd(`zokrates generate-proof -w ${account} -j ${account}.proof.json`);

    const { proof } = JSON.parse(
      fs.readFileSync(`../chain/circuits/${account}.proof.json`).toString('utf-8'),
    );

    return proof;
  }

  // NOTE: does not work properly with zorkates-js
  private async _generateProof(account: string, income: number, target: number): Promise<object> {
    this.logger.log(`Generating proof for ${account} with ${income} >= ${target}`);

    const { witness } = this.provider.computeWitness(this.artifacts, [
      income.toString(),
      target.toString(),
    ]);

    const generated = this.provider.generateProof(this.artifacts.program, witness, this.keypair.pk);

    const isVerified = this.provider.verify(this.keypair.vk, generated);
    this.logger.log(`Proof is verified: ${isVerified}`);
    this.logger.log(`Proof inputs: ${JSON.stringify(generated.inputs)}`);

    return generated.proof;
  }
}
