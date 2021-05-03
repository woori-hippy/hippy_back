import axios from 'axios';
import * as googleapis from 'googleapis';
import env from '../configs/index.js';
import * as UserRepository from '../repositorys/UserRepository';

const { google } = googleapis;
const oauth2Client = new google.auth.OAuth2(env.GOOGLE.CLIENT_ID, env.GOOGLE.CLIENT_SECRET, env.GOOGLE.REDIRECT_URL);

export const kakoSignIn = async (req, res, next) => {
  try {
    const response = await axios({
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        Authorization: `Bearer ${req.headers.authorization}`,
      },
    });
    if (!response) {
      console.log('에러 발생');
      next(err);
    } else {
      const name = response.data.properties.nickname;
      const email = response.data.kakao_account.email;
      console.log(name, email);

      const findUser = await UserRepository.findByEmailAndKakao(email);

      if (!findUser[0]) {
        const signUp = await UserRepository.createByKakao(email, name);
        req.session.passport = { user: signUp.id };

        //session id 보내기
        res.send(signUp);
      } else {
        // 세션테이블에 값을 저장. 유저 아이디 ?
        // 쿠키셋팅? res.headers

        req.session.passport = { user: findUser[0].id };
        // console.log(findUser[0]);
        // console.log(req.session);
        // console.log(req.session.passport);
        //console.log(session.Store);
        res.send(findUser);
      }
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const googleSignIn = async (req, res, next) => {
  const tokens = {
    expiry_date: req.body.expiry_date,
    access_token: req.body.access_token,
    token_type: req.body.token_type,
    id_token: req.body.id_token,
    scope: req.body.scope,
  };
  oauth2Client.setCredentials(tokens);
  google.options({ auth: oauth2Client });

  const people = google.people({
    version: 'v1',
    auth: oauth2Client,
  });
  const me = await people.people.get({
    resourceName: 'people/me',
    personFields: 'names',
  });

  const email = me.data.emailAddresses[0];

  const user = await UserRepository.findByEmailAndGoogle(email);
  if (user[0]) {
    req.session.passport = { user: user[0].id };
    if (user.isArtist) {
      res.send({ isArtist: true, name: user[0].name, email: user[0].email });
    } else {
      res.send({ isArtist: false, name: user[0].name, email: user[0].email });
    }
  } else {
    const user = await UserRepository.createByGoogle(email, me.data.names[0]);
    req.session.passport = { user: user[0].id };
    if (user.isArtist) {
      res.send({ isArtist: true, name: user[0].name, email: user[0].email });
    } else {
      res.send({ isArtist: false, name: user[0].name, email: user[0].email });
    }
  }
};
