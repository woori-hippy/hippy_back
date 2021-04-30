import express from 'express';
import * as AuthHelper from '../middlewares/AuthHelper';
import * as AuthService from '../services/AuthService';
import * as JoinValidaton from '../validations/JoinValidation';

const router = express.Router();
router.post('/signin', AuthHelper.isNotLoggedIn, AuthService.signin);
router.post('/signout', AuthHelper.isLoggedIn, AuthService.signout);
router.post('/signup', JoinValidaton.joinRequest, AuthHelper.isNotLoggedIn, AuthService.signup);

export default router;
