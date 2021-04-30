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

  createNFT: async function (account, ipfsHash, callback) {
    const self = this;

    try {
      // Bootstrap the MetaCoin abstraction for Use.
      //gas비 디폴트 값. 혹은 계정 연동
      CreateToken.setProvider(self.web3.currentProvider);
      CreateToken.web3.eth.defaultAccount = CreateToken.web3.eth.accounts[0];

      const meta = await CreateToken.deployed();
      console.log(meta);

      const nft = await meta.mint(account, ipfsHash, { from: account, gas: 3000000 }); // gas limit 변경

      callback(nft);
    } catch (err) {
      console.error(err);
      callback(err);
    }
  },
};
