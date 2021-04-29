const contract = require('truffle-contract');

const metacoin_artifact = require('../../build/contracts/MetaCoin.json');
const createToken_artifact = require('../../build/contracts/CreateToken.json');
const MetaCoin = contract(metacoin_artifact);
const CreateToken = contract(createToken_artifact);

module.exports = {
  start: function (callback) {
    const self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    CreateToken.setProvider(self.web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    self.web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        console.log('There was an error fetching your accounts.');
        return;
      }

      if (accs.length == 0) {
        console.log("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }
      self.accounts = accs;
      self.account = self.accounts[2];

      callback(self.accounts);
    });
  },
  refreshBalance: function (account, callback) {
    const self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    CreateToken.setProvider(self.web3.currentProvider);

    let meta;
    CreateToken.deployed()
      .then(instance => {
        meta = instance;
        return meta.balanceOf.call(account);
      })
      .then(value => {
        callback(value.valueOf());
      })
      .catch(e => {
        console.log(e);
        callback('Error 404');
      });
  },
  transferNFT: function (sender, receiver, tokenId, callback) {
    const self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    CreateToken.setProvider(self.web3.currentProvider);

    let meta;
    CreateToken.deployed()
      .then(instance => {
        meta = instance;
        return meta.safeTransferFrom(sender, receiver, tokenId);
      })
      .then(() => {
        self.refreshBalance(sender, answer => {
          callback(answer);
        });
      })
      .catch(e => {
        console.log(e);
        callback('ERROR 404');
      });
  },

  createNFT: function (account, ipfsHash, callback) {
    const self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    CreateToken.setProvider(self.web3.currentProvider);

    let meta;
    CreateToken.deployed()
      .then(instance => {
        meta = instance;
        return meta.mint.call(account, ipfsHash);
      })
      .then(() => {
        self.refreshBalance(account, answer => {
          callback(answer);
        });
      })
      .catch(e => {
        console.log(e);
        callback('ERROR 404');
      });
  },
};
