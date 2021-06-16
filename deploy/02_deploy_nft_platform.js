module.exports = async ({deployments, getUnnamedAccounts}) => {
  const {deploy, log} = deployments;
  const [owner] = await getUnnamedAccounts();
  const NTKToken = await deploy('NTK', { from: owner, args: [] }); //los parámetros del constructor se pasan mediante args
  await deploy('PNTK', { from: owner, args: [] }); 
  await deploy('NFT_Platform', { from: owner, args: [NTKToken.address] }); 
  log("Tokens ERC20 deployed!")
 
}