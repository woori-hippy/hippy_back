const KakaoStrategy = require('passport-kakao').Strategy;
import * as UserRepository from '../../repositorys/UserRepository';
import env from '../index';

module.exports = passport => {
  console.log('test');
  passport.use(
    'kakao',
    new KakaoStrategy(
      {
        // 첫번째 인자에는 인증에 필요한 값들을 적어넣는다. (카카오 서버에 전송하여 인증받을 내용.)
        callbackURL: '/auth/kakao/callback',
        clientID: env.KAKAO_KEY, // 내 앱의 REST API
      },
      async (accessToken, refreshToken, profile, done) => {
        // 사용자가 유효한지 확인하는 verify 콜백함수
        // accessToken과 refreshToken: 인증을 유지시켜주는 토큰
        // profile: 사용자 정보 객체
        // done(error, user): passport-twitter가 자체적으로 req.login와 serializeUser 호출하여 req.session에 사용자 아이디를 저장한다
        const {
          id,
          username: name,
          _json: {
            kakao_account: { email },
          },
        } = profile;

        console.log(accessToken);
        console.log(profile);
        console.log(name, email);
        try {
          const exUser = UserRepository.findByEmailAndKakao(email);
        } catch (err) {
          console.error(err);
        }
      }
    )
  );
};
