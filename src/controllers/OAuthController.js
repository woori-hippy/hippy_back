import express from 'express';
import * as AuthHelper from '../middlewares/AuthHelper';
import * as OAuthService from '../services/OAuthService';

const router = express.Router();

router.get('/kakao', AuthHelper.isNotLoggedIn, OAuthService.kakoSignin);
router.post('/google', AuthHelper.isNotLoggedIn, OAuthService.googleSignIn);

export default router;
