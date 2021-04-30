import bcrypt from 'bcrypt';
import passport from 'passport';
import * as UserRepository from '../repositorys/UserRepository';

export const signin = (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (!user) {
      return res.status(401).send({ message: '해당 유저 정보가 없습니다.' });
    }
    return req.login(user, loginError => {
      if (loginError) {
        console.error(loginError);
        return res.status(500).send({ message: '로그인에 실패했습니다.' });
      }
      if (user.isArtist) {
        res.send({ isArtist: true, name: user.name });
      } else {
        res.send({ isArtist: false, name: user.name });
      }
    });
  })(req, res, next);
};

export const signout = (req, res, next) => {
  req.logout();
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      next(err);
    } else {
      res.clearCookie('connect.sid');
      res.send({ message: '로그아웃 성공' });
    }
  });
};

export const signup = async (req, res, next) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const user = await UserRepository.createByLocal(req.body);
    if (user) {
      res.send({ message: '회원 가입 성공' });
    } else {
      throw new Error('알 수 없는 에러 발생');
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};
