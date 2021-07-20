module.exports = async ({deployments, getUnnamedAccounts}) => {
  const {deploy, log} = deployments;
  const [owner] = await getUnnamedAccounts();
  const GTKToken = await deploy('GTK', { from: owner, args: [] }); //los parámetros del constructor se pasan mediante args
  await deploy('Gobernance', { from: owner, args: [GTK.address] }); 
  log("Gobernance deployed!")
 
}