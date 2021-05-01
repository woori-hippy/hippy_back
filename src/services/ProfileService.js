import * as UserRepository from '../repositorys/UserRepository';

const truffle_connect = require('../connection/app.js');

export const findUser = async (req, res, next) => {
  try {
    res.send({ user: req.user });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const findTokeList = async (req, res, next) => {
  try {
    const NFTList = await truffle_connect.findTokenList(req.user.coinAccount);
    const NFTListWithOnSale = [];
    for await (const nft of NFTList) {
      console.log(nft);
      //const onSale = await ProductRepository.findProduct(req.user.id, nft.tokenId);
      //   if (onSale) {
      //     nft.onSale === true;
      //     NFTListWithOnSale.push(nft);
      //   } else {
      //     nft.onSale === false;
      //     NFTListWithOnSale.push(nft);
      //   }
    }

    res.send({ NFTListWithOnSale });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const updateCoinAccount = async (req, res, next) => {
  try {
    const upatedUser = await UserRepository.updateCoinAccount(req.user.id, req.body.coinAccount);
    res.send(upatedUser);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const updateWooriAccount = async (req, res, next) => {
  try {
    const upatedUser = await UserRepository.updateWooriAccount(req.user.id, req.body);
    res.send(upatedUser);
  } catch (err) {
    console.error(err);
    next(err);
  }
};
