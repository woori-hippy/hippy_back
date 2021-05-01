const contract = require('truffle-contract');
const createToken_artifact = require('../../build/contracts/CreateToken.json');
const CreateToken = contract(createToken_artifact);
import { promisify } from 'util';

const sendEth = async (CreateToken, estimatevalue, from, to) => {
  //이더계산(단위변환)
  const getGasPrice = promisify(CreateToken.web3.eth.getGasPrice);
  const ethervalue = await getGasPrice();

  const gasPrice = Number(ethervalue);
  const etherValue = CreateToken.web3.fromWei(estimatevalue * gasPrice, 'ether');

  await CreateToken.web3.eth.sendTransaction({
    from,
    to,
    value: CreateToken.web3.toWei(etherValue, 'ether'),
  });
};

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

  estimateGasTransferNFT: async function (sender, receiver, tokenId) {
    try {
      const self = this;

      CreateToken.setProvider(self.web3.currentProvider);
      CreateToken.web3.eth.defaultAccount = sender;
      const meta = await CreateToken.deployed();

      return meta.safeTransferFrom.estimateGas(sender, receiver, Number(tokenId), { from: sender, gas: 3000000 });
    } catch (err) {
      console.error(err);
    }
  },

  transferNFT: async function (sender, receiver, tokenId) {
    const self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    CreateToken.setProvider(self.web3.currentProvider);
    CreateToken.web3.eth.defaultAccount = sender;
    const meta = await CreateToken.deployed();

    const estimatevalue = await meta.safeTransferFrom.estimateGas(sender, receiver, tokenId, { from: sender, gas: 3000000 });
    await sendEth(CreateToken, estimatevalue, sender, receiver);

    await meta.safeTransferFrom(sender, receiver, tokenId);
    const refreshBalance = await meta.safeTransferFrom(sender);

    return refreshBalance;
  },

  estimateGasCreateNFT: async function (account, ipfsHash) {
    const self = this;
    CreateToken.setProvider(self.web3.currentProvider);
    CreateToken.web3.eth.defaultAccount = account;
    const meta = await CreateToken.deployed();

    return meta.mint.estimateGas(account, ipfsHash, { from: account, gas: 3000000 });
  },

  createNFT: async function (account, ipfsHash, callback) {
    const self = this;
    try {
      // Bootstrap the MetaCoin abstraction for Use.
      //gas비 디폴트 값. 혹은 계정 연동
      CreateToken.setProvider(self.web3.currentProvider);
      CreateToken.web3.eth.defaultAccount = account;

      const meta = await CreateToken.deployed();

      //gas used find
      const estimatevalue = await meta.mint.estimateGas(account, ipfsHash, { from: account, gas: 3000000 });

      //이더계산(단위변환)
      const getGasPrice = promisify(CreateToken.web3.eth.getGasPrice);
      const ethervalue = await getGasPrice();

      const gasPrice = Number(ethervalue);
      const etherValue = CreateToken.web3.fromWei(estimatevalue * gasPrice, 'ether');

      //gas mainaddress  -> create address send.
      const getAccounts = promisify(CreateToken.web3.eth.getAccounts);
      const accountsList = await getAccounts();

      await CreateToken.web3.eth.sendTransaction({
        from: accountsList[0],
        to: account,
        value: CreateToken.web3.toWei(etherValue, 'ether'),
      });

      const nft = await meta.mint(account, ipfsHash, { from: account, gas: 3000000 }); // gas limit 변경

      callback(nft);
    } catch (err) {
      console.error(err);
      callback(err);
    }
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
