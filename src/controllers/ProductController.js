import express from 'express';
import * as AuthHelper from '../middlewares/AuthHelper';
import * as ProductService from '../services/ProductService';
const router = express.Router();

router.post('/', AuthHelper.isLoggedIn, AuthHelper.isArtist, ProductService.register);
router.post('/buy', AuthHelper.isLoggedIn, ProductService.buy);

export default router;
