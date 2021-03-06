import express from 'express';
import * as NFTService from '../services/TestService';

const router = express.Router();

router.get('/getAccounts', NFTService.getAccounts);
router.post('/getBalance', NFTService.getBalance);
router.post('/transferNFT', NFTService.transferNFT);
router.post('/createNFT', NFTService.createNFT);
router.get('/getAllBalance', NFTService.getAllBalance);
router.post('/findTokenList', NFTService.findTokenList);
router.post('/test', NFTService.test);

export default router;
