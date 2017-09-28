var Migrations = artifacts.require("./Migrations.sol");

module.exports = function(deployer) {
  console.log('in initial migrations');
  deployer.deploy(Migrations);
};
