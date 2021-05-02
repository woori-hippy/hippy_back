import truffleConnect from '../connection/app';

export const create = async (req, res, next) => {
  try {
    const ipfsHash = req.body.ipfsHash;

    await truffleConnect.createNFT(req.user.coinAccount, ipfsHash);
    const tokenList = await truffleConnect.findTokenList(req.user.coinAccount);

    console.log(tokenList);
    res.send(tokenList[tokenList.length - 1]);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const estimate = async (req, res, next) => {
  try {
    const ipfsHash = req.body.ipfsHash;

    res.send({ GasFee: await truffleConnect.estimateGasCreateNFT(req.user.coinAccount, ipfsHash) });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
