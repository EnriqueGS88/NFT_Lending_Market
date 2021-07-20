const { ethers } = require("hardhat"); //hardhat ya lo importa y no sería necesario

require("chai").should();

describe("1) Tests for Gobernance contract", () => {
  it("Deployment should assign total supply to owner", async () => {
    const [owner] = await ethers.getSigners();
    const GTKToken = await ethers.getContractFactory("GTK"); //getContractFactory está inyectada por Hardhat
    const GTK = await GTKToken.deploy();
    const totalSupply = await GTK.totalSupply();
    const ownerBalance = await GTK.balanceOf(owner.address);
    totalSupply.should.equal(ownerBalance);
  });
});
