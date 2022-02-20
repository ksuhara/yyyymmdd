import * as chai from "chai";
import { solidity } from "ethereum-waffle";
import hre, { ethers } from "hardhat";

chai.use(solidity);
const { expect } = chai;

describe("NFT", function () {
  let nftContract: any;
  this.beforeEach(async function () {
    const YYYYMMDDContract = await ethers.getContractFactory("YYYYMMDD");
    nftContract = await YYYYMMDDContract.deploy("YYYYMMDD", "YMD");
  });

  it("Test", async function () {
    await nftContract.mint(1);
    const tokenURI = await nftContract.tokenURI(1);
    console.log(tokenURI);
  });
});
