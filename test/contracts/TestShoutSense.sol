pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../../contracts/ShoutSense.sol";

contract TestShoutSense {

  function testEmptyAccounts() {
    ShoutSense shoutsense = ShoutSense(DeployedAddresses.ShoutSense());

    uint expected = 0;
    uint actual = shoutsense.advertiserCount();

    Assert.equal(actual, expected, "0 expected");
  }
}
