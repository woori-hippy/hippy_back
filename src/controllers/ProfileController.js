import express from 'express';
import * as AuthHelper from '../middlewares/AuthHelper';
import * as ProfileService from '../services/ProfileService';

const router = express.Router();

router.get('/', AuthHelper.isLoggedIn, ProfileService.findUser);
router.get('/coin', AuthHelper.isLoggedIn, ProfileService.findTokeList);
router.patch('/woori', AuthHelper.isLoggedIn, ProfileService.updateWooriAccount);
router.patch('/coin', AuthHelper.isLoggedIn, ProfileService.updateCoinAccount);

export default router;
