pragma solidity ^0.4.15;

import './AdvertiserAccount.sol';
import './PublisherAccount.sol';
import './ShoutSenseUtils.sol';

contract ShoutSense {

  uint private deploymentTime;
  mapping (bytes32 => AdvertiserAccount) private advertiserAccounts;
  mapping (bytes32 => PublisherAccount) private publisherAccounts;

  uint public advertiserCount;

  function ShoutSense() {
      deploymentTime = now;
  }

  function createAdvertiserAccount(bytes32 accountId) {
    require (!isAdvertiser(accountId));
    AdvertiserAccount account = new AdvertiserAccount(accountId);
    advertiserAccounts[accountId] = account;
    advertiserCount++;
  }

  function getAdvertiserAccount(bytes32 accountId) constant returns (AdvertiserAccount) {
    return advertiserAccounts[accountId];
  }

  function isAdvertiser(bytes32 accountId) public constant returns (bool) {
    return address(advertiserAccounts[accountId]) > 0;
  }

  function getPublisherAccount(bytes32 accountId) constant returns (PublisherAccount) {
    if (accountId != 0)
      require(false);
    else require(false);
  }

  function getContractDeploymentTime() public constant returns (uint) {
    return deploymentTime;
  }
}
