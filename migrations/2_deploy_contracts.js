const Campaign = artifacts.require("./Campaign.sol");
const AdvertiserAccount = artifacts.require("./AdvertiserAccount.sol");
const PublisherAccount = artifacts.require("./PublisherAccount.sol");
const ShoutSense = artifacts.require("./ShoutSense.sol");
const DeploySecrets = require("../../deploy-secrets.json")
const jsonfile = require("jsonfile");
const s3 = require('s3');

const client = s3.createClient({
  s3Options: {
    accessKeyId: DeploySecrets.awsAccessKey,
    secretAccessKey: DeploySecrets.awsSecretKey,
  }
});

console.log('in deploy contracts');

module.exports = function(deployer, network) {
  console.log('in deploy contracts, network: ' + network);
  // deployer.deploy(Campaign);
  // deployer.link(Campaign, AdvertiserAccount);
  deployer.deploy(AdvertiserAccount);
  deployer.deploy(PublisherAccount);
  deployer.link(AdvertiserAccount, ShoutSense);
  deployer.link(PublisherAccount, ShoutSense);
  deployer.deploy(ShoutSense)
    .then(function () {
      console.log('ShoutSense Address on : ' + network + ' => ' + ShoutSense.address)
      const addressFile = "deployed_contracts_" + network + ".json"
      const addressFileJson = {shoutsenseAddress: ShoutSense.address}
      jsonfile.writeFileSync(addressFile, addressFileJson)
      const params = {
        localFile: addressFile,
        s3Params: {
          Bucket: DeploySecrets.awsContractBucket,
          Key: addressFile,
        }
      };
      var uploader = client.uploadFile(params);
      uploader.on('error', function(err) {
        console.error("unable to upload:", err.stack);
      });
      uploader.on('progress', function() {
        console.log("progress", uploader.progressMd5Amount, uploader.progressAmount, uploader.progressTotal);
      });
      uploader.on('end', function() {
        console.log("finished uploading contract address to S3");
      });
    });
};
