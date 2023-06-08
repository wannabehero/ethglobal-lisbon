import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect, assert } from "chai";
import { ethers } from "hardhat";

describe("CryptoBureau", function () {
  async function deployCryptoBureauFixture() {
    const [owner, nonOwner] = await ethers.getSigners();

    const WorldID = await ethers.getContractFactory("MockWorldID");
    const worldId = await WorldID.deploy();

    const CryptoBureau = await ethers.getContractFactory("CryptoBureau");
    const bureau = await CryptoBureau.deploy(
      worldId.address,
      "hello",
      "world",
    );
    await bureau.deployed();
    return { bureau, owner, nonOwner };
  }

  async function deployERCLenderFixture() {
    const { bureau, owner, nonOwner } = await deployCryptoBureauFixture();

    const MockToken = await ethers.getContractFactory("MockToken");
    const tokenCollateral = await MockToken.deploy();
    const tokenLending = await MockToken.deploy();

    await Promise.all([
      tokenCollateral.deployed(),
      tokenLending.deployed(),
    ]);

    const Lender = await ethers.getContractFactory("ERC20Lender");
    const lender = await Lender.deploy(
      bureau.address,
      tokenLending.address,
      tokenCollateral.address,
    );

    await tokenLending.mint(lender.address, ethers.utils.parseEther("1000"));

    await lender.deployed();

    await bureau.setLender(lender.address, true);

    return { lender, bureau, tokenCollateral, tokenLending, owner, nonOwner }
  }

  async function deployHelperFixture() {
    const { bureau, owner, nonOwner } = await deployCryptoBureauFixture();

    const MockHelper = await ethers.getContractFactory("MockHelper");
    const helper = await MockHelper.deploy(
      bureau.address,
    );

    await helper.deployed();

    await bureau.setHelper(helper.address, {
      multiplier: ethers.utils.parseEther("1.5"),
    });

    return { helper, bureau, owner, nonOwner }
  }

  async function deployTrueLayerHelperFixture() {
    const { bureau, owner, nonOwner } = await deployCryptoBureauFixture();

    const Verifier = await ethers.getContractFactory("PlonkVerifier");
    const verifier = await Verifier.deploy();

    const TrueLayerHelper = await ethers.getContractFactory("TrueLayerHelper");
    const helper = await TrueLayerHelper.deploy(
      bureau.address,
      verifier.address
    );

    await bureau.setHelper(helper.address, {
      multiplier: ethers.utils.parseEther("2"),
    });

    return { helper, bureau, owner, nonOwner };
  }

  describe("Deployment", function () {
    it("Should deploy CryptoBureau", async function () {
      const { bureau } = await loadFixture(deployCryptoBureauFixture);
      assert.ok(bureau.address);
    });

    it("Should deploy ERC20Lender", async function () {
      const { lender } = await loadFixture(deployERCLenderFixture);
      assert.ok(lender.address);
    });
  });

  describe("Registration", function () {
    it("Should register a user", async function () {
      const { bureau, owner } = await loadFixture(deployCryptoBureauFixture);
      await bureau.register(1, 13, [0, 1, 2, 3, 4, 5, 6, 7]);
      const [collateralCoef] = await bureau.score(owner.address);
      expect(collateralCoef).to.equal(ethers.utils.parseEther("1.3"));
    });
  });

  describe("Helpers", function () {
    it("Should update user score", async function () {
      const { bureau, owner, helper } = await loadFixture(deployHelperFixture);

      // register first
      await bureau.register(1, 13, [0, 1, 2, 3, 4, 5, 6, 7]);

      // basic score
      const [collateralCoef] = await bureau.score(owner.address);
      expect(collateralCoef).to.equal(ethers.utils.parseEther("1.3"));

      // working with helper
      await helper.verifyMe();

      // score should be updated
      const [collateralCoef2] = await bureau.score(owner.address);
      expect(collateralCoef2).to.equal(ethers.utils.parseEther("1.2"));
    });
  });

  describe("Lending", function () {
    it("Should lend", async function () {
      const { lender, tokenCollateral, tokenLending, bureau, owner } = await loadFixture(deployERCLenderFixture);

      await bureau.register(1, 13, [0, 1, 2, 3, 4, 5, 6, 7]);

      const collateralRequired = await lender.collateralRequired(owner.address, ethers.utils.parseEther("100"));
      expect(collateralRequired).to.equal(ethers.utils.parseEther("130"));

      await tokenCollateral.mint(owner.address, ethers.utils.parseEther("130"));
      await tokenCollateral.approve(lender.address, ethers.utils.parseEther("130"));
      await lender.increaseCollateral(ethers.utils.parseEther("130"));

      await lender.borrow(ethers.utils.parseEther("100"));

      const [coef1] = await bureau.score(owner.address);
      expect(coef1).to.equal(ethers.utils.parseEther("1.5"));

      await tokenLending.approve(lender.address, ethers.utils.parseEther("100"));
      await lender.repay(ethers.utils.parseEther("100"));

      const [coef2] = await bureau.score(owner.address);
      expect(coef2).to.equal(ethers.utils.parseEther("1.28"));
    });
  });

  describe("TrueLayer", function () {
    it("should verify using TrueLayerHelper", async function () {
      const { bureau, owner, helper } = await loadFixture(deployTrueLayerHelperFixture);

      // register first
      await bureau.register(1, 13, [0, 1, 2, 3, 4, 5, 6, 7]);

      // basic score
      const [collateralCoef] = await bureau.score(owner.address);
      expect(collateralCoef).to.equal(ethers.utils.parseEther("1.3"));

      // working with helper
      const proof = '0x07acbbe3136a6875e9b197a0025bbfe439a75f689f92838096f575f7af99983b2d130e5aed661f2453c219e933006acd6c9c3381af69b721d32a48b69bca641c2670e14dc24a24ca0f8dc841ab693b80c5957e08de26ae303c9ee3517ad2e3262dc1a6845215a2ade2df20633888fa67275db0083a9bd414f95994a7e1a008ca1a46fe34b8ade21522db48a3c6c4e3704521ec915fa4da9abc66853fe18d79d72f12890b5c225162e3eadab70d4c4ba60e97bb648ad8feb45c23e56eeee14ec70975747bf2ccbd742998b4f70e1ef1149985887dbdd3660ced1f9a79f0cb44b30edaa583ee2cf97aa276a7935a452ffec7871a0a6b4576bf674ccd6562f8839426c50be2a9c8f5d88a8ab88b4d8ea33020484745fea6f56c945ce73f8f2fd53b21450e561c676df550031d3c0abeea71eecfac748924215f8b9613ad072a86bb25d90c6a0a26aec2230357e5f7645cee044db224ddeea9039daaf09e020616791234e0272c7a4780f1ef0ae48566590a80011870f0fa81d335cd9e2f39f622362da80b03c6c545caf4b9e9e72d02b52c513a3d55fcd5a7d3f4a459afc0d0242c1e95b335844c50ad963dc2a05073032b42515962c4ab7123b23a8046611905da08cbe59dfbc97e3ebe93ce3a9ba09764d294d9f57b62ea882ec36573c0730e760d6f1ee450cb2abe90466561299dc074255cf08a5e8b594f2992fd769107c7850b6bb3105e6431f4fab27f3f77ac9baf5ca9e07a27d4c6ee3a306f472c1e0dc2030f46aeb4d51ed0cb7422c1a4546198449a1446c676d0ee150139f2d10966ce071b3714e0ad5bfe3a053acbc08893b45810057fc1b893f192f654ed12eb1a961217ac5a8f1a6e2424e71a72d6d6fe215c6cfa90518def4bab519a83868a4f4f27a974c8d563ed8d30177245d2b6e433b190d7345767ba7d9ae0916e0768ec48079555086b0f308fc7a61892921f8e0912c2b5fa0ddbe7c61701d53549693c3f20813aac6394b8dffe4395bfcf8de4550902699a9262742107ef6d3b67c6027b268a1c99ec599f365f950d813ac696aeb2add620199542908c979ff7901f016d154a316c6b6af9171de80a95888b055ee08b5f70e010708e2851e3fc0879d907';
      await helper.verify(100, proof);

      // score should be updated
      const [collateralCoef2] = await bureau.score(owner.address);
      expect(collateralCoef2).to.equal(ethers.utils.parseEther("1.1"));
    });
  });
});