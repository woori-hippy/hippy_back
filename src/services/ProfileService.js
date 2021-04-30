import * as UserRepository from '../repositorys/UserRepository';

const truffle_connect = require('../connection/app.js');

/**
 *
 * @todo findById req.user.id로 받게 해야 한다.
 */
export const findById = async (req, res, next) => {
  try {
    const userInfo = await UserRepository.findById(1);
    const NFTList = await truffle_connect.findTokenList(userInfo.coinAccount);
    res.send({ userInfo, NFTList });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
