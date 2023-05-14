import * as fs from 'fs';

import * as CryptoBureau from './bureau';
import * as TrueLayerHelper from './trueLayer';
import * as Lender from './lender';
import * as SismoHelper from './sismo';
import * as PolygonIdHelper from './polygonId';

async function main() {
  const bureau = await CryptoBureau.deploy();

  const trueLayer = await TrueLayerHelper.deploy(bureau);
  await TrueLayerHelper.setInBureau(bureau, trueLayer);

  const sismo = await SismoHelper.deploy(bureau);
  await SismoHelper.setInBureau(bureau, sismo);

  const polygonId = await PolygonIdHelper.deploy(bureau);
  await PolygonIdHelper.setInBureau(bureau, polygonId);
  await PolygonIdHelper.setZKPRequest(polygonId);

  const lender = await Lender.deploy(bureau);
  await Lender.setInBureau(bureau, lender);
  await Lender.topUp(lender);

  const deployments = {
    bureau: bureau.address,
    trueLayer: trueLayer.address,
    sismo: sismo.address,
    polygonId: polygonId.address,
    lender: lender.address,
  };
  fs.writeFileSync('deployments.json', JSON.stringify(deployments, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});