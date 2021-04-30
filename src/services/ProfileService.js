import * as UserRepository from '../repositorys/UserRepository';

const truffle_connect = require('../connection/app.js');

export const findById = async (req, res, next) => {
  try {
    const userInfo = await UserRepository.findById(req.user.id);
    const NFTList = await truffle_connect.findTokenList(userInfo.coinAccount);
    res.send({ userInfo, NFTList });
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
    const upatedUser = await UserRepository.updateWooriAccount(req.user.id, req.body.wooriAccount);
    res.send(upatedUser);
  } catch (err) {
    console.error(err);
    next(err);
  }
};
