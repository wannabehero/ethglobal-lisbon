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

    const Verifier = await ethers.getContractFactory("Verifier");
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
      const proof = {"a":["0x2bbc231ef22ef5a5017c6be73225e146f5391825eca4e020ae3f136a84287287","0x076a9ecb98421a7a5756649be22c886285893a0380f91406059cef2379341d6a"],"b":[["0x0256d006968948c0f85617282211bbe87a2e37fbbaf586c4d5d5fdcb8743377d","0x0a28e81cab9ee87d5415456a3f32ecb7683fcc01a9550abf1bf706d014489ef6"],["0x20aa85f7b11382faff7240de38e8cc7ca9aa502c8a9de63c005bc9591805e3f8","0x24ede656d8cd4dcf4642ba03de3e2009a0390f7a3498940c2a05e4d8f1999427"]],"c":["0x1e4294d0fbb6a96c7543da66d7b1fa250f54c0c1ff2ea160879570d8710c3ed8","0x21a7e11efae7f7b42dbd3aac3450b92226e2634903879d12e984b2757f7f913b"]};
      await helper.verify(100, proof as any);

      // score should be updated
      const [collateralCoef2] = await bureau.score(owner.address);
      expect(collateralCoef2).to.equal(ethers.utils.parseEther("1.1"));
    });
  });
});