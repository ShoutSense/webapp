require('babel-core/register')
require('babel-polyfill')

const bip39 = require("bip39");
const hdkey = require('ethereumjs-wallet/hdkey');
const ProviderEngine = require("web3-provider-engine");
const WalletSubprovider = require('web3-provider-engine/subproviders/wallet.js');
const FiltersSubprovider = require('web3-provider-engine/subproviders/filters.js');
const Web3Subprovider = require("web3-provider-engine/subproviders/web3.js");
const Web3 = require("web3");
const DeploySecrets = require("../deploy-secrets.json")

// Get our mnemonic and create an hdwallet
var mnemonic = DeploySecrets.deploymentWalletPassphrase;
var hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));

// Get the first account using the standard hd path.
const wallet_hdpath = "m/44'/60'/0'/0/";
const wallet = hdwallet.derivePath(wallet_hdpath + "1").getWallet();
const address = "0x" + wallet.getAddress().toString("hex");
console.log(address);

const providerUrl = "https://ropsten.infura.io/" + DeploySecrets.infuraKey;
const engine = new ProviderEngine();
engine.addProvider(new WalletSubprovider(wallet, {}));
engine.addProvider(new FiltersSubprovider());
engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(providerUrl)));
engine.on('error', function(err) {
    // report connectivity errors
    console.error('error from truffle.js:')
    console.error(err.stack)
})
engine.start(); // Required by the provider engine.

module.exports = {
  contracts_directory: 'src/contracts',
  networks: {
    development_infura_ropsten: {
      network_id: 3,    // Official ropsten network id
      provider: engine, // Use our custom provider
      from: address     // Use the address we derived
    },
    development_local_testrpc: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    development_infura_rinkeby: {
      network_id: 4,    // Official rinkeby network id
      provider: engine, // Use our custom provider
      from: address     // Use the address we derived
    }
  }
};
