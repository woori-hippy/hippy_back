import bcrypt from 'bcrypt';
import passportLocal from 'passport-local';
import * as UserRepository from '../../repositorys/UserRepository';

const LocalStrategy = passportLocal.Strategy;

export default passport => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email', //req.body.id
        passwordField: 'password', //req.body.password
        session: true, // 세션에 저장 여부
      },
      async (email, password, cb) => {
        try {
          const findUser = await UserRepository.findByEmailAndLocal(email);
          if (!findUser[0]) {
            return cb(null, false);
          }

          const result = await bcrypt.compare(password, findUser[0].password);
          if (!result) {
            return cb(null, false);
          }
          return cb(null, findUser[0]);
        } catch (err) {
          return cb(err);
        }
      }
    )
  );
};
