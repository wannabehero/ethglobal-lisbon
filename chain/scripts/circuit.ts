import * as fs from "fs";
import * as path from "path";
import { initialize } from "zokrates-js";


async function selialize() {
  const { verifier, artifacts } = await generateCircuit();

  if (!fs.existsSync("./zk")) {
    fs.mkdirSync("./zk", { recursive: true });
  }

  fs.writeFileSync("./contracts/ZKVerifier.sol", verifier);
  fs.writeFileSync("./zk/program.json", JSON.stringify({
    program: [...artifacts.program],
    abi: artifacts.abi,
  }));
}

export async function generateCircuit() {
  const provider = await initialize();

  const source = fs.readFileSync(
    path.join(__dirname, "../circuits/gte.zok"),
  ).toString('utf-8');

  const artifacts = provider.compile(source);
  const keypair = provider.setup(artifacts.program);

  const verifier = provider.exportSolidityVerifier(keypair.vk);
  return { verifier, keypair, artifacts, provider };
}

selialize().catch((err) => {
  console.error(err);
  process.exit(1);
});
