import * as CryptoBureau from './bureau';
import * as TrueLayerHelper from './trueLayer';
import * as Lender from './lender';
import * as SismoHelper from './sismo';
import * as PolygonIdHelper from './polygonId';

async function main() {
  const bureau = await CryptoBureau.deploy();
  await TrueLayerHelper.deploy(bureau);
  await SismoHelper.deploy(bureau);
  await PolygonIdHelper.deploy(bureau);
  await Lender.deploy(bureau);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});