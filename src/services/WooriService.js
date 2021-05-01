import axios from 'axios';
import env from '../configs/index.js';

//전 계좌 조회
export const allAcount = async (req, res) => {
  try {
    const response = await axios({
      method: 'post',
      url: 'https://openapi.wooribank.com:444/oai/wb/v1/finance/getIndivAllAccInfo',
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
        dataBody: {},
      },
      headers: {
        appkey: env.APIKEY,
        token: req.user.wooriToken,
      },
    });
    res.send(response);
  } catch (err) {
    console.error(err);
  }
};

//인증 - 토큰받기
export const wooriToken = async (req, res) => {
  const { COMC_DIS, HP_NO, HP_CRTF_AGR_YN, FNM, RRNO_BFNB, ENCY_RRNO_LSNM } = req.body;
  try {
    const response = await axios({
      method: 'post',
      url: 'https://openapi.wooribank.com:444/oai/wb/v1/login/getCellCerti',
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
          COMC_DIS,
          HP_NO,
          HP_CRTF_AGR_YN,
          FNM,
          RRNO_BFNB,
          ENCY_RRNO_LSNM,
        },
      },
      headers: {
        appkey: env.APIKEY,
      },
    });
    res.send(response);
  } catch (err) {
    console.error(err);
  }
};

//휴대폰 인증 완료
export const phone = async (req, res) => {
  const { RRNO_BFNB, ENCY_RRNO_LSNM, ENCY_SMS_CRTF_NO, CRTF_UNQ_NO } = req.body;
  try {
    const response = await axios({
      method: 'post',
      url: 'https://openapi.wooribank.com:444/oai/wb/v1/login/executeCellCerti',
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
          RRNO_BFNB,
          ENCY_RRNO_LSNM,
          ENCY_SMS_CRTF_NO,
          CRTF_UNQ_NO,
        },
      },
      headers: {
        appkey: env.APIKEY,
      },
    });
    res.send(response);
  } catch (err) {
    console.error(err);
  }
};
