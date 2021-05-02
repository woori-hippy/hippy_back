import axios from 'axios';
import * as UserRepository from '../repositorys/UserRepository';
const passport = require('passport');

export const kakoSignin = async (req, res, next) => {
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
