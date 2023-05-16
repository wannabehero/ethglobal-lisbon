import * as fs from 'fs';
import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';

@Injectable()
export class ZkService {
  private readonly logger = new Logger(ZkService.name);

  private async zokratesCmd(cmd: string) {
    return new Promise((resolve, reject) => {
      exec(
        cmd,
        {
          cwd: '../chain/circuits',
        },
        (error, stdout, stderr) => {
          if (error) {
            this.logger.error(stderr);
            reject(error);
          } else {
            this.logger.log(stdout);
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

  // NOTE: does not work properly with zorkates-js when using with hardhat
  // private async _generateProof(account: string, income: number, target: number): Promise<object> {
  //   this.logger.log(`Generating proof for ${account} with ${income} >= ${target}`);

  //   const { witness } = this.provider.computeWitness(this.artifacts, [
  //     income.toString(),
  //     target.toString(),
  //   ]);

  //   const generated = this.provider.generateProof(this.artifacts.program, witness, this.keypair.pk);

  //   const isVerified = this.provider.verify(this.keypair.vk, generated);
  //   this.logger.log(`Proof is verified: ${isVerified}`);
  //   this.logger.log(`Proof inputs: ${JSON.stringify(generated.inputs)}`);

  //   return generated.proof;
  // }
}
