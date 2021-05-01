import express from 'express';
import * as AuthHelper from '../middlewares/AuthHelper';
import * as NFTService from '../services/NFTService';

const router = express.Router();

router.post('/create', AuthHelper.isLoggedIn, AuthHelper.isArtist, NFTService.create);
router.post('/estimate', AuthHelper.isLoggedIn, AuthHelper.isArtist, NFTService.estimate);

export default router;
