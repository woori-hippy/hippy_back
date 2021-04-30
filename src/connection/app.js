const contract = require('truffle-contract');
const createToken_artifact = require('../../build/contracts/CreateToken.json');
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

    // Bootstrap the MetaCoin abstraction for Use.
    CreateToken.setProvider(self.web3.currentProvider);
    CreateToken.web3.eth.defaultAccount = account;

    const meta = await CreateToken.deployed();
    const nft = await meta.mint(account, ipfsHash, { from: account, gas: 3000000 });

    callback(nft);
  },

  findTokenList: async function (account) {
    const self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    CreateToken.setProvider(self.web3.currentProvider);
    CreateToken.web3.eth.defaultAccount = account;

    const meta = await CreateToken.deployed();
    const totalSupply = await meta.totalSupply();
    const list = [];
    for (let j = 0; j < totalSupply; j++) {
      const t = await meta.tokenByIndex(j);
      const apr = await meta.getApproved(t);

      if ((await meta.ownerOf(t)) === account) {
        const ipfsHash = await meta.allTokens(t);
        //console.log(asset);
        list.push({ ipfsHash, tokenId: t, approved: apr });
      }
    }

    return list;
  },
};