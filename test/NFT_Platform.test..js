const { ethers } = require("hardhat"); //hardhat ya lo importa y no sería necesario

require("chai").should();

describe('1) Tests for NFT Platform contract', () => {
  it('Deployment should assign total supply to owner', async () => {
    //const signers = await ethers.getSigners(); //Desestructuro en owner
    const [owner] = await ethers.getSigners();
    const NTKToken = await ethers.getContractFactory("NTK"); //getContractFactory está inyectada por Hardhat
    const NBT = await NTKToken.deploy();
    const totalSupply = await NBT.totalSupply();
    const ownerBalance = await NBT.balanceOf(owner.address);
    totalSupply.should.equal(ownerBalance);
  });

  it('Should transfer tokens between accounts', async () => {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const NTKToken = await ethers.getContractFactory("NTK"); //getContractFactory está inyectada por Hardhat
    const NBT = await NTKToken.deploy();
    // Transfer 50 tokens from owner to addr1
    await NBT.transfer(addr1.address, 50);
    (await NBT.balanceOf(addr1.address)).should.equal(50);
    // Transfer 50 tokens from addr1 to addr2
    await NBT.connect(addr1).transfer(addr2.address, 50); 
    (await NBT.balanceOf(addr2.address)).should.equal(50);
    await NBT.connect(addr1).transfer(addr2.address, 60).should.be.revertedWith("transfer amount exceeds balance");
  });

  it('Should emit transfer event', async () => {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const NTKToken = await ethers.getContractFactory("NTK"); //getContractFactory está inyectada por Hardhat
    const NBT = await NTKToken.deploy();
    // Transfer 50 tokens from owner to addr1
    await NBT.transfer(addr1.address, 50)
      .should.emit(NBT, "Transfer")
      .withArgs(owner.address, addr1.address, 50);
  });
})
