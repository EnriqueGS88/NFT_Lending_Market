
task("balance", "Prints an account's balance")
    .addParam("account", "The account's address")
    .setAction(async taskArgs => {
        
        const account = await ethers.utils.getAddress(taskArgs.account)
        const balance = await ethers.provider.getBalance(account)

        console.log(ethers.utils.formatEther(balance), "ETH")
    })

module.exports = {}
