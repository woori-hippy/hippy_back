import bcrypt from 'bcrypt';
import * as UserRepository from '../repositorys/UserRepository';

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
