import axios from 'axios';
import env from '../configs/index';
import truffleConnect from '../connection/app';
import * as ProductRepository from '../repositorys/ProductRepository';
import * as UserRepository from '../repositorys/UserRepository';

export const register = async (req, res, next) => {
  try {
    req.body.tokenId = Number(req.body.tokenId);
    req.body.price = Number(req.body.price);
    const productInfo = await ProductRepository.create(req.user.id, req.body);
    if (productInfo) {
      res.send({ message: '상품 등록 ㅊㅋ' });
    } else {
      throw new Error('알 수 없는 에러 발생');
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const buy = async (req, res, next) => {
  try {
    console.log(req.user);

    const ProductInfo = await ProductRepository.findByIdWithUserNameAndHeart(Number(req.body.productId));
    const { price, tokenId, userId } = ProductInfo;

    if (userId === req.user.id) throw new Error('본인의 물건은 구입할 수 없습니다.');

    const userInfo = await UserRepository.findById(userId);
    const response = await axios({
      method: 'post',
      url: 'https://openapi.wooribank.com:444/oai/wb/v1/trans/executeWooriAcctToWooriAcct',
      data: {
        dataHeader: {
          UTZPE_CNCT_IPAD: '',
          UTZPE_CNCT_MCHR_UNQ_ID: '',
          UTZPE_CNCT_TEL_NO_TXT: '',
          UTZPE_CNCT_MCHR_IDF_SRNO: '',
          UTZ_MCHR_OS_DSCD: '',
          UTZ_MCHR_OS_VER_NM: '',
          UTZ_MCHR_MDL_NM: '',
          UTZ_MCHR_APP_VER_NM: '',
        },
        dataBody: {
          WDR_ACNO: req.user.wooriAccount,
          TRN_AM: price,
          RCV_BKCD: '020',
          RCV_ACNO: '120458*******',
          PTN_PBOK_PRNG_TXT: '상품구매',
        },
      },
      headers: {
        appkey: env.APPKEY,
        token: req.user.wooriToken,
      },
    });
    if (response.status === 200) {
      const estimatevalue = await truffleConnect.estimateGasTransferNFT(userInfo.coinAccount, req.user.coinAccount, tokenId);
      await truffleConnect.sendETH(userInfo.coinAccount, estimatevalue);
      await truffleConnect.transferNFT(userInfo.coinAccount, req.user.coinAccount, tokenId);

      await ProductRepository.updateProductState(ProductInfo.id, true);
      const rate = (price / 100) * 98;

      await axios({
        method: 'post',
        url: 'https://openapi.wooribank.com:444/oai/wb/v1/trans/executeWooriAcctToWooriAcct',
        data: {
          dataHeader: {
            UTZPE_CNCT_IPAD: '',
            UTZPE_CNCT_MCHR_UNQ_ID: '',
            UTZPE_CNCT_TEL_NO_TXT: '',
            UTZPE_CNCT_MCHR_IDF_SRNO: '',
            UTZ_MCHR_OS_DSCD: '',
            UTZ_MCHR_OS_VER_NM: '',
            UTZ_MCHR_MDL_NM: '',
            UTZ_MCHR_APP_VER_NM: '',
          },
          dataBody: {
            WDR_ACNO: '120458*******',
            TRN_AM: rate,
            RCV_BKCD: '020',
            RCV_ACNO: userId,
            PTN_PBOK_PRNG_TXT: '상품구매',
          },
        },
        headers: {
          appkey: env.APPKEY,
          token: env.TOKEN,
        },
      });
    } else {
      throw new Error('우리은행이 문제임.');
    }
    res.send({ message: '판매 완료' });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const findAll = async (req, res, next) => {
  try {
    const productList = await ProductRepository.findAllByNotIsSoldWithUserAndHeart();

    if (req.user) {
      productList.map(product => {
        product.isClick = false;
        product.heart.map(heart => {
          if (heart.userId === req.user.id) product.isClick = true;
        });
      });
    }

    res.send(productList);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const findById = async (req, res, next) => {
  try {
    const productInfo = await ProductRepository.findByIdWithUserNameAndHeart(Number(req.params.id));
    if (productInfo) {
      if (req.user) {
        productInfo.isClick = false;
        productInfo.heart.map(heart => {
          if (heart.userId === req.user.id) productInfo.isClick = true;
        });
      }

      res.send(productInfo);
    } else {
      throw new Error('해당 상품은 존재하지 않습니다.');
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};
