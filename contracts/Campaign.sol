pragma solidity ^0.4.15;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract Campaign is Ownable {

  bytes32 private campaignId;
  bytes32 private ownerAccountId;
  uint private spendLimit;
  uint private shoutBounty;
  uint private endTimestamp;
  bytes32 private tweetSignature;
  Status private currentStatus;

  enum Status {
      Active,
      Paused,
      Finished
  }

  function Campaign (bytes32 _campaignId, bytes32 _ownerAccountId, uint _spendLimit, uint _shoutBounty, bytes32 _tweetSignature) payable Ownable() {
    endTimestamp = now + 604800; //SEVEN_DAYS_IN_SECONDS
    currentStatus = Status.Active;
    campaignId = _campaignId;
    ownerAccountId = _ownerAccountId;
    spendLimit = _spendLimit;
    shoutBounty = _shoutBounty;
    tweetSignature = _tweetSignature;
  }

  function getCampaignId() constant returns(bytes32) {
      return campaignId;
  }
}
