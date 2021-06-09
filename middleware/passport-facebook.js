const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const models = require('../models');

const dotenv = require('dotenv');
dotenv.config;

// - GET /auth/facebook             -> 인증 링크 생성
// - GET /auth/facebook/callback    -> 페이스북 로그인 시도 후 이동하는 URL
// - GET /auth/facebook/            -> 로그인 성공 시 이동하는 URL
// - GET /auth/facebook/            -> 실패 시 이동하는 링크

passport.use(new FacebookStrategy({
    // https://developers.facebook.com에서 appId 및 scretID 발급
    clientID: process.env.FACEBOOK_APPID , //입력하세요
    clientSecret: process.env.FACEBOOK_SECRETCODE , //입력하세요.
    callbackURL: `${process.env.SITE_DOMAIN}/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'photos', 'email'] //받고 싶은 필드 나열
},
async (  accessToken , refreshToken , profile, done) => {
    
        //아래 하나씩 찍어보면서 데이터를 참고.
        //console.log(accessToken);
        //console.log(profile);
        //console.log(profile.displayName);
        //console.log(profile.emails[0].value);
        //console.log(profile._raw);
        //console.log(profile._json);
   
        try {
            const username = `fb_${profile.id}`;    //다른 소셜과 로그인을 연동할 경우, 중복 방지를 위해 접두에 'fb_'추가

            // 존재하는지 체크
            const exist = await models.User.count({
                where : {
                    // 아이디로 조회
                    username
                }
            });
 
            if(!exist){
                // 존재하면 바로 세션에 등록
                user = await models.User.create({
                    username ,
                    displayname : profile.displayName ,
                    password : "facebook"                       //password는 null 허용되지 않게 세팅되어 있으므로 디폴트 비밀번호 설정
                });
            }else{
                user = await models.User.findOne({
                    where : { 
                        username
                    } 
                });
            }
 
            return done(null, user );
        } catch (e) {
            console.log(e);
        }

    }
));


passport.serializeUser( (user, done) => {
    done(null, user);
});
  
passport.deserializeUser( (user, done) => {
    done(null, user);
});



module.exports = passport;