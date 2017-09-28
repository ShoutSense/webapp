const GasInfo =  require('../../config/gas_info.json');
const ShoutSense = artifacts.require("./ShoutSense.sol");
const AdvertiserAccount = artifacts.require("./AdvertiserAccount.sol");
const Eth = require('ethjs')

let accountId = "0x65bc47b9db01a4424243f0915347c080b20fbb8709e6f008e1307d736d01ae45";
let shoutsenseInstance = null;

beforeEach(async function() {
  if (!shoutsenseInstance) {
    shoutsenseInstance = await ShoutSense.deployed();
  }
});

contract('ShoutSense Advertisers', function(accounts) {

  it("Should have no advertiser accounts yet", async function() {
    let actualCount = await shoutsenseInstance.advertiserCount();
    assert.equal(actualCount.valueOf(), 0, "there was more than 0");
  });

  it("Should add an advertiser account successfully", async function() {
    let transactionReceipt = await shoutsenseInstance.createAdvertiserAccount(
      accountId, {
        gas: GasInfo.CreateAccountCall.gas_limit,
        gasPrice: GasInfo.CreateAccountCall.gas_price
      });
    assert.ok(transactionReceipt);
    assert.ok(transactionReceipt.tx);
    let gasUsed = transactionReceipt.gasUsed;
    assert.notEqual(gasUsed, GasInfo.CreateAccountCall.gas_limit, "this transaction likely failed with an eror and consumed all the gas");
  });

  it("Should have one advertiser account now", async function() {
    let actualCount = await shoutsenseInstance.advertiserCount();
    assert.equal(actualCount.valueOf(), 1, "there was not one account");
  });

  it("Should have the advertiser account we added", async function() {
    let accountAddress = await shoutsenseInstance.getAdvertiserAccount(accountId);
    assert.ok(accountAddress);
    assert.ok(Eth.isAddress(accountAddress));
    let account = AdvertiserAccount.at(accountAddress);
    assert.ok(account.getOwnerAccountId, "not sure what we got back for this account reference: " + JSON.stringify(account))
    let getOwnerAccountId = await account.getOwnerAccountId();
    assert.equal(getOwnerAccountId, accountId, "not a valid account object");
  });

  it("Should not add the same advertiser account again", async function() {
    try {
      let transactionReceipt = await shoutsenseInstance.createAdvertiserAccount(
        accountId, {
          gas: GasInfo.CreateAccountCall.gas_limit,
          gasPrice: GasInfo.CreateAccountCall.gas_price
        });
        assert.fail('the transaction is expected to throw an error due to duplicate entries');
    }
    catch(error) {
      assert.ok(error)
    }
  });
});
