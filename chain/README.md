# CryptoBureau

## Deployment
Populate env first
```sh
WORLD_ID_APP_ID=app_staging_111222
WORLD_ID_ACTION_ID=register
PRIVATE_KEY=0xpriVatEkeY
```

then deploy
```sh
npx hardhat run scripts/full.ts --network mumbai
```

## Zokrates

Install zorkates https://zokrates.github.io/gettingstarted.html

```sh
# get new verifier contract
cd circuits
zokrates export-verifier
```

## Snarks

Install circom https://docs.circom.io/getting-started/installation/#installing-circom

```sh
cd snarks

# compile the circuit
circom gte.circom --r1cs --wasm --sym

# ptau phases
npx snarkjs powersoftau new bn128 14 pot14_0000.ptau -v
npx snarkjs powersoftau contribute pot14_0000.ptau pot14_0001.ptau --name="CryptoBureau" -v
npx snarkjs powersoftau beacon pot14_0001.ptau pot14_beacon.ptau F061A508385D924D905E14A282434BA601814B32F51EBF5F0235DA8423DD2C 10 -n="Final"
npx snarkjs powersoftau prepare phase2 pot14_beacon.ptau pot14_final.ptau -v

# export r1cs
npx snarkjs r1cs export json gte.r1cs gte.r1cs.json

# setup plonk verification
npx snarkjs plonk setup gte.r1cs pot14_final.ptau gte_plonk.zkey

# export the verification key
npx snarkjs zkey export verificationkey gte_plonk.zkey verification_key.json

# export the verifier
npx snarkjs zkey export solidityverifier gte_plonk.zkey PlonkVerifier.sol
```

## PolygonID
Use https://issuer-demo.polygonid.me/ to generate a custom claim

Schema url: https://raw.githubusercontent.com/wannabehero/ethglobal-lisbon/main/chain/id/diploma.json