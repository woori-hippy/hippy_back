import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import NFTController from './controllers/NFTController';
import ProfileController from './controllers/ProfileController';
import TestController from './controllers/TestController';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/', TestController);
app.use('/nft', NFTController);
app.use('/profile', ProfileController);

export default app;
