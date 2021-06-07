const passport = require('passport');                       //npm install passport.
const LocalStrategy = require('passport-local').Strategy;   //npm install passport-local.
const passwordHash = require('../helpers/passwordHash');
const models = require('../models');


//passport. 정책작성 => serialize/deserialize 작성 => 미들웨어 적용
//정책작성
passport.use(new LocalStrategy({
    usernameField: 'username',          //login.html 템플릿의 name 속성
    passwordField : 'password',         //login.html 템플릿의 password 속성
    passReqToCallback : true
  }, 
  async ( req , username , password, done) => {
  
    // 조회
    const user = await models.User.findOne({
        where: {
            username,
            password : passwordHash(password),
        },
        // attributes: { exclude: ['password'] }        //조회 시 제외할 항목
    });
  
  
    // 유저에서 조회되지 않을시
    if(!user){
        return done(null, false, { message: '일치하는 아이디 패스워드가 존재하지 않습니다.' });
  
    // 유저에서 조회 되면 세션등록쪽으로 데이터를 넘김
    }else{
        return done(null, user.dataValues );
    }
    
  }
));


//serialize/deserialize 작성
passport.serializeUser(  (user, done) => {      //최초 로그인 시 호출
    console.log('serializeUser');
    done(null, user);
});

passport.deserializeUser(  (user, done) => {    //로그인된 경우 페이지 변경 시 호출
    console.log('deserializeUser');
    //user.password = '';                   //이와 같이 user의 값을 재설정 가능
    done(null, user);
});


module.exports = passport;