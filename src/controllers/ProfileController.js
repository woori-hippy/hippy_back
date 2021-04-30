import express from 'express';
import * as ProfileService from '../services/ProfileService';
const router = express.Router();

router.get('/', ProfileService.findById);

export default router;
