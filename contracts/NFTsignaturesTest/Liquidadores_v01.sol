//"SPDX-License-Identifier: UNLICENSED"

/**
Merge of nftfi & scaffold contracts
*/

pragma solidity ^0.8.0;


// https://docs.openzeppelin.com/contracts/4.x/erc721

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// IERC721 checks if the destination address can handle NFTs
// This is achieved with the safeTransferFrom function
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";


// Struct will be extended to cover for:
    // minimum Bid Increment
    // Tie Bids not allowed
    // Overtime extensions

contract Auction is IERC721Receiver {
    struct tokenDetails {
        address seller; // In our case, this is the nftPool
        uint128 price;
        uint256 duration;
        uint256 maxBid;
        address maxBidUser;
        bool isActive;
        uint256[] bidAmouts;
        address[] users;
    }

// Define Mappings to store auction data

    mapping(address=> mapping(uint256 => tokenDetails)) public tokenToAuction;

// Map for a given NFT token contract to an NFT Id to bidder's EOA
    mapping(address=> mapping(uint256 => mapping(address=> uint256))) public bids;


    /*
        Called by the Pool. Places NFT for auction
    */

    function createTokenAuction(
        address _nft,       // address of the NFT token contract
        uint256 _tokenId,
        uint128 _price,
        uint256 _duration
    ) external {
        require(msg.sender != address(0), "Invalid Address");
        require(_nft != address(0), "Invalid Account");
        require(_price >0, "Price should be larger than 0");
        require(_duration >0, "Invalid duration value");
        tokenDetails memory _auction = tokenDetails({
            seller: msg.sender,
            price: uint128(_price),
            duration: uint256(_duration),
            maxBid: 0,
            maxBidUser: address(0),
            isActive: true,
            bidAmouts: new uint256[](0),
            users: new address[](0)
        });

        address owner = msg.sender;
        ERC721(_nft).safeTransferFrom(owner, address(this), _tokenId);
        
        // In the mapping, for that NFT contract address and Id, set the value from _auction
        tokenToAuction[_nft][_tokenId] = _auction;  


    }

    /*
        Called by Liquidators. Bid on NFT owned by the pool
    */

    function bid(address _nft, uint256 _tokenId) external payable {

        tokenDetails storage auction = tokenToAuction[_nft][_tokenId]; // what is this doing on Storage ?
        require(msg.value >= auction.price, "Bid price is less than current price");
        require(auction.isActive, "Auction not active yet");
        require(auction.duration > block.timestamp, "Auction deadline already passed");
        if (bids[_nft][_tokenId][msg.sender] > 0) {

            // If bidding address is not 0, call value of the mapping

            (bool success, ) = msg.sender.call{value: bids[_nft][_tokenId][msg.sender]}("");
            require(success);
        }
        bids[_nft][_tokenId][msg.sender] = msg.value;

        // Set the first bid as the maxBid and maxBidUser
        if (auction.bidAmounts.length ==0) {
            auction.maxBid = msg.value;
            auction.maxBidUser = msg.sender;
        } else {
            uint256 lastIndex = auction.bidAmounts.length - 1;

            // Why does it check against bidAmounts instead of maxBid ??
            require(auction.bidAmounts[lastIndex] < msg.value, "Current Max bid is higher than your bid" );
            auction.maxBid = msg.value;
            auction.maxBidUser = msg.sender;
        }

        // Add Liquidator address and bid into auction registry
        auction.users.push(msg.sender);
        auction.bidAmounts.push(msg.value);


    }

    function executeSale(address _nft, uint256 _tokenId) external {

        tokenDetails storage auction = tokenToAuction[_nft][_tokenId];
        require(auction.duration <= block.timestamp,"Auction deadline did not pass yet");
        require(auction.seller == msg.sender, "You are not the NFT seller");

        // Check if Auction is still Active, if it is, turn it Inactive
        require(auction.isActive, "Auction not active");
        auction.isActive = false;

        if (auction.bidAmounts.length == 0) { // If there are no bids, return NFT to seller
            ERC721(_nft).safeTransferFrom(
                address(this),
                auction.seller,
                _tokenId
            );
        } else {

            (bool success, ) = auction.seller.call{value: auction.maxBid}("");
            require(success);
            for (uint256 i=0; i<auction.users.length; i++) { // Check user by user if it's the maxBidUser ??
                if(auction.users[i]) != auction.maxBidUser) {
                    (success,) = auction.users[i].call{
                        value: bids[_nft][_tokenId][auction.users[i]]
                    }("");
                    require(success);
                }
            }
            ERC721(_nft).safeTransferFrom(
                address(this),
                auction.maxBidUser,
                _tokenId
            );            
        }
    }

    function cancelAuction(address _nft, uint256 _tokenId) external{
        tokenDetails storage auction = tokenToAuction[_nft][_tokenId];
        require(auction.seller == msg.sender, "You are not the seller");
        require(auction.isActive != false, "Auction is already closed");
        auction.isActive = false;
        bool success;
        for (uint256 i = 0; i < auction.users.length; i++) {
            (success, ) = auction.users.[i].call{value: bids[_nft][_tokenId][auction.users[i]]}("");
            require(success);
        }
        ERC721(_nft).safeTransferFrom(address(this),auction.seller,_tokenId);


    }

    function getTokenAuctionDetails(address _nft, uint256 _tokenId) public view returns(tokenDetails memory){
        tokenDetails memory auction = tokenToAuction[_nft][_tokenId];
        return auction;
    }


    // Next function overrides the original function from IERC721Receiver contract ??
    function onERC721Received(address,address,uint256,bytes calldata) external pure override returns(bytes4) {
        return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
    }


    receive() external payable {}

}




