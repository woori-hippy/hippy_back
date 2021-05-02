import express from 'express';
import * as AuthHelpter from '../middlewares/AuthHelper';
import * as HeartService from '../services/HeartService';
const router = express.Router();

router.get('/', AuthHelpter.isLoggedIn, HeartService.click);

export default router;
