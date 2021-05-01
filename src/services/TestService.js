const truffle_connect = require('../connection/app.js');

export const getAccounts = (req, res) => {
  console.log('**** GET /getAccounts ****');
  truffle_connect.start(answer => {
    res.send(answer);
  });
};

export const getBalance = (req, res) => {
  console.log('**** GET /getBalance ****');
  console.log(req.body);
  const currentAcount = req.body.account;

  truffle_connect.refreshBalance(currentAcount, answer => {
    res.send({ NFTCount: answer });
  });
};

export const getAllBalance = (req, res) => {
  truffle_connect.start(answer => {
    answer.map(currentAcount => {
      truffle_connect.refreshBalance(currentAcount, answer => {
        console.log(answer);
      });
    });
  });
};

export const transferNFT = async (req, res) => {
  console.log('**** GET /sendCoin ****');
  console.log(req.body);

  const sender = req.body.sender;
  const receiver = req.body.receiver;
  const tokenId = req.body.tokenId;

  const sendNFT = await truffle_connect.transferNFT(sender, receiver, tokenId);
  res.send(sendNFT);
};

export const createNFT = async (req, res) => {
  console.log('**** POST /createNFT ****');
  console.log(req.body);

  const ipfsHash = req.body.ipfsHash;
  const currentAccount = req.body.account;

  res.send(await truffle_connect.createNFT(currentAccount, ipfsHash));
};

export const findTokenList = async (req, res) => {
  console.log('**** POST /findTokenList ****');
  console.log(req.body);

  const currentAccount = req.body.account;

  const list = await truffle_connect.findTokenList(currentAccount);
  return res.send(list);
};

export const test = async (req, res) => {
  const sender = req.body.sender;
  const receiver = req.body.receiver;
  const tokenId = req.body.tokenId;
  const ipfsHash = req.body.ipfsHash;

  const sendNFT = await truffle_connect.estimateGasTransferNFT(sender, receiver, tokenId);
  res.send({ sendNFT });
};
