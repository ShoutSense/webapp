pragma solidity ^0.4.15;

import './Campaign.sol';
import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract AdvertiserAccount is Ownable {

  bytes32 private ownerAccountId;
  Status private currentStatus;
  mapping (bytes32 => Campaign) private campaigns;

  enum Status {
      New,
      Active,
      Paused,
      Finished
  }

  function AdvertiserAccount (bytes32 accountId) Ownable() {
      ownerAccountId = accountId;
      currentStatus = Status.New;
  }

  function getOwnerAccountId() public constant returns (bytes32) {
    return ownerAccountId;
  }

  function getCurrentStatus() public constant returns (Status) {
    return currentStatus;
  }

/*
function isCampaign(bytes32 campaignId) public constant returns(bool exists) {
    return campaigns[campaignId].getCampaignId() == campaignId;
}

  function getCampaign(bytes32 campaignId) public constant returns (Campaign) {
    return campaigns[campaignId];
  }

  function createCampaign (bytes32 campaignId, uint spendLimit, uint shoutBounty, bytes32 tweetSignature)
    payable onlyOwner {
      assert(spendLimit > 0);
      assert(shoutBounty > 0);
      assert(this.balance >= spendLimit);
      require (!isCampaign(campaignId));
      Campaign newCampaign = (new Campaign).value(spendLimit)(campaignId, ownerAccountId, spendLimit, shoutBounty, tweetSignature);
      campaigns[campaignId] = newCampaign;
  }
*/
}
