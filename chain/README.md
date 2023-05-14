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

## PolygonID
Use https://issuer-demo.polygonid.me/ to generate a custom claim

Schema url: https://raw.githubusercontent.com/wannabehero/ethglobal-lisbon/main/chain/id/diploma.json