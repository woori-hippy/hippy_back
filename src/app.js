import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import passport from 'passport';
import env from './configs';
import passportConfig from './configs/passport';
import AuthController from './controllers/AuthController';
import NFTController from './controllers/NFTController';
import ProductController from './controllers/ProductController';
import ProfileController from './controllers/ProfileController';
import TestController from './controllers/TestController';
import WooriController from './controllers/WooriController';

const app = express();
passportConfig(passport);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser(env.COOKIE_SECRET));
app.use(session({ secret: env.COOKIE_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/test', TestController);
app.use('/nft', NFTController);
app.use('/profile', ProfileController);
app.use('/auth', AuthController);
app.use('/product', ProductController);
app.use('/woori', WooriController);

export default app;
