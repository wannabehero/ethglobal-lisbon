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
});