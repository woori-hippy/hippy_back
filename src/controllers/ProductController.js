import express from 'express';
import * as AuthHelper from '../middlewares/AuthHelper';
import * as ProductService from '../services/ProductService';
const router = express.Router();

router.post('/buy', AuthHelper.isLoggedIn, ProductService.buy);
router.post('/', AuthHelper.isLoggedIn, ProductService.register);
router.get('/', ProductService.findAll);
router.get('/:id', ProductService.findById);

export default router;
