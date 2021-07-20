//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "hardhat/console.sol";


interface ERC165 {
    /// @notice Query if a contract implements an interface
    /// @param interfaceID The interface identifier, as specified in ERC-165
    /// @dev Interface identification is specified in ERC-165. This function
    ///  uses less than 30,000 gas.
    /// @return `true` if the contract implements `interfaceID` and
    ///  `interfaceID` is not 0xffffffff, `false` otherwise
    function supportsInterface(bytes4 interfaceID) external view returns (bool);
}

/// @title ERC-2767 Governance
/// @dev ERC-165 InterfaceID: 0xd8b04e0e
interface ERC2767 is ERC165 {
    /// @notice Gets number votes required for achieving consensus
    /// @dev Should cost less than 30000 gas
    /// @return Required number of votes for achieving consensus
    function quorumVotes() external view returns (uint256);

    /// @notice The address of the Governance ERC20 token
    function getToken() external view returns (address);
    
}


contract GTK is ERC20 {
  
    constructor() ERC20("GTK token", "GTK") {
      _mint(msg.sender, 1000000*10**18);
    } 

  /*  /// @dev Modifier to check if a user account is blocked from making transfers
    modifier whenNotBlocked(address _account) {
      require(!governance.isBlocked(_account));
      _;
    }

    function transfer(address to, uint256 value) 
      public 
      whenNotBlocked(msg.sender)
      returns (bool) 
    {
      return super.transfer(to, value);
    }

    function transferFrom(address from, address to, uint256 value)
      public 
      whenNotBlocked(from)
      returns (bool)
    {
      return super.transferFrom(from, to, value);
    }

*/
      function transfer(address to, uint256 value) 
      public override
      returns (bool) 
    {
      return super.transfer(to, value);
    }

    function transferFrom(address from, address to, uint256 value)
      public override
      returns (bool)
    {
      return super.transferFrom(from, to, value);
    }
}

contract Governance is ERC2767 {
  using SafeMath for uint256;
  // Map a proposal ID to a specific proposal
  mapping(uint => Proposal) public proposals;
  // Map a proposal ID to a voter's address and their vote
  mapping(uint => mapping(address => bool)) public voted;
  // Determine if the user is blocked from voting
  mapping (address => uint) public blocked;
  
  uint votesNeeded = 10;
  uint proposalIDcount = 0;
  uint voteLength = 3 days;

  struct Proposal {
    uint votesReceived;
    bool passed;
    address submitter;
    uint votingDeadline;
  }
  
  IERC20 immutable private token;

  event VotesSubmitted(
        uint proposalID, 
        uint votesReceived, 
        bool passed
      );

  event ProposalSubmitted(uint proposalID);
  
  constructor(IERC20 _token) {
    token = _token;
  }

  /// @notice The number of votes in support of a proposal required in order for a quorum to be reached and for a vote to succeed
  function quorumVotes() public view override returns (uint256) { return 600000*10**18; } // 60% of token

  function getToken() external view override returns (address) {
    return address(token);
  }

  function isBlocked(address _account) public view returns(bool) {
    return (blocked[_account] != 0);
  }

  function supportsInterface(bytes4 interfaceID) external view override returns (bool) {
    return interfaceID == 0x01ffc9a7;
  }

  /// @dev Modifier to check if a user account is blocked from making transfers
  modifier whenNotBlocked(address _account) {
    require(!isBlocked(_account));
    _;
  }

  modifier onlyEligibleVoter(address _voter) {
   uint256 balance = token.balanceOf(_voter);
   require(balance > 0);
  _;
  }

  /// @dev Allows a token holder to submit a proposal to vote on
  function submitProposal()
    public
    onlyEligibleVoter(msg.sender)
    whenNotBlocked(msg.sender)
    returns (uint proposalID)
  {
    uint votesReceived = token.balanceOf(msg.sender);
    proposalID = addProposal(votesReceived);
    emit ProposalSubmitted(proposalID);
    return proposalID;
  }


  /// @dev Adds a new proposal to the proposal mapping
  /// @param _votesReceived from the user submitting the proposal
  function addProposal(uint _votesReceived)
   internal
   returns (uint proposalID)
  {
   uint votes = _votesReceived;
   if (votes < votesNeeded) {
      if (proposalIDcount == 0) {
        proposalIDcount = 1;
      }
    proposalID = proposalIDcount;
    proposals[proposalID] = Proposal({
    votesReceived: votes,
    passed: false,
    submitter: msg.sender,
    votingDeadline: block.timestamp + voteLength
     });
    blocked[msg.sender] = proposalID;
    voted[proposalID][msg.sender] = true;
    proposalIDcount = proposalIDcount.add(1);
    return proposalID;
   }
   else {
    require(token.balanceOf(msg.sender) >= votesNeeded);
    endVote(proposalID);
    return proposalID;
   }
  }

  /// @dev Allows token holders to submit their votes in favor of a specific proposalID
  /// @param _proposalID The proposal ID the token holder is voting on
  function submitVote(uint _proposalID)
    onlyEligibleVoter(msg.sender)
    whenNotBlocked(msg.sender)
    public
    returns (bool)
  {
    Proposal memory p = proposals[_proposalID];
    if (blocked[msg.sender] == 0) {
      blocked[msg.sender] = _proposalID;
    } else if (p.votingDeadline >   proposals[blocked[msg.sender]].votingDeadline) 
    {
  // this proposal's voting deadline is further into the future than
  // the proposal that blocks the sender, so make it the blocker       
      blocked[msg.sender] = _proposalID;
    }
    uint votesReceived = token.balanceOf(msg.sender);
    proposals[_proposalID].votesReceived += votesReceived;
    voted[_proposalID][msg.sender] = true;
    if (proposals[_proposalID].votesReceived >= votesNeeded) 
    {
      proposals[_proposalID].passed = true;
      emit VotesSubmitted(
        _proposalID, 
        votesReceived, 
        proposals[_proposalID].passed
      );
      endVote(_proposalID);
    }
    emit VotesSubmitted(
      _proposalID, 
      votesReceived, 
      proposals[_proposalID].passed
    );
    return true;
  }

  /// @dev Sets when a particular vote will end
  /// @param _proposalID The specific proposal's ID
  function endVote(uint _proposalID) 
    internal
  {
    require(voteSuccessOrFail(_proposalID));
    updateProposalToPassed(_proposalID);
  }

  function updateProposalToPassed(uint _proposalID) internal {
    proposals[_proposalID].passed = true;
  }

  /// @dev Determines whether or not a particular vote has passed or failed
  /// @param _proposalID The proposal ID to check
  /// @return Returns whether or not a particular vote has passed or failed
  function voteSuccessOrFail(uint _proposalID) 
    public
    view
    returns (bool)
  {
    return proposals[_proposalID].passed;
  }
}
