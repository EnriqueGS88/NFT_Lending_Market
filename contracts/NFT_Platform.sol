//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.3;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "hardhat/console.sol";

contract NTK is ERC20 {
    constructor() ERC20("NFT token", "NTK") {
    _mint(msg.sender, 1000000*10**18);
    }
}

contract PNTK is ERC20 {
    address admin;

    constructor() ERC20("Platform NTK tokens", "PNTK") {
        admin = msg.sender; // MyPlatform contract
    }

    function mint(address to, uint256 amount) public virtual {
        require( msg.sender == admin); 
        _mint(to, amount);
    }

    function burn(address account, uint256 amount) public virtual {
        require( msg.sender == admin);
        _burn(account, amount);
    }
}

contract NFT_Platform {
    using SafeERC20 for IERC20;
    IERC20 immutable public ntk;
    PNTK immutable public pntk;

    constructor(IERC20 _ntk) {
        ntk = _ntk;
        pntk = new PNTK();
    }

    function depositNTK() public {
        uint256 NTKamount = ntk.allowance(msg.sender, address(this));
        require(NTKamount > 0);
        ntk.safeTransferFrom(msg.sender, address(this), NTKamount);
        pntk.mint(msg.sender, NTKamount);
        console.log("depositNTK - sender: %s, receiver: %s, amount: %s", msg.sender, address(this), NTKamount);
    }
    
    function withdrawNTK(uint256 _PNTKtoWithdraw) public {
        uint256 PNTKtotal = pntk.balanceOf(msg.sender);
        require( _PNTKtoWithdraw <= PNTKtotal);
        pntk.burn(msg.sender, _PNTKtoWithdraw);
        ntk.safeTransfer(msg.sender, _PNTKtoWithdraw);
        console.log("withdrawNTK - sender: %s, receiver: %s, amount: %s", address(this), msg.sender, _PNTKtoWithdraw);
    }
}