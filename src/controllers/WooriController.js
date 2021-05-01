import express from 'express';
import * as AuthHelper from '../middlewares/AuthHelper';
import * as WooriService from '../services/WooriService';

const router = express.Router();

router.get('/allAcount', AuthHelper.isLoggedIn, WooriService.allAcount);
router.post('/wooriToken', AuthHelper.isLoggedIn, WooriService.wooriToken);
router.post('/phone', AuthHelper.isLoggedIn, WooriService.phone);

export default router;
