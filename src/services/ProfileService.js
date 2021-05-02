import * as ProductRepository from '../repositorys/ProductRepository';
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
    const onSale = await ProductRepository.findProduct(req.user.id);

    NFTList.sort((a, b) => {
      if (a.tokenId.toNumber() < b.tokenId.toNumber()) return true;
      else false;
    });

    NFTList.map(nft => {
      nft.productId = null;
    });

    onSale.map(sale => {
      NFTList.map(nft => {
        if (sale.tokenId === nft.tokenId.toNumber()) {
          nft.productId = sale.id;
        }
      });
    });

    res.send(NFTList);
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
