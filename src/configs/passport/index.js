import * as UserRepository from '../../repositorys/UserRepository';
import localStrategy from './LocalStrategy';

export default passport => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const findUser = await UserRepository.findById(id);
      if (!findUser) done(new Error({ message: 'Wrong User Id' }));
      done(null, findUser);
    } catch (err) {
      done(err);
    }
  });
  localStrategy(passport);
};
