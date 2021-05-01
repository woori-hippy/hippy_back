import express from 'express';
import * as AuthHelper from '../middlewares/AuthHelper';
import * as ProductService from '../services/ProductService';
const router = express.Router();

router.post('/register', AuthHelper.isLoggedIn, AuthHelper.isArtist, ProductService.register);

export default router;
