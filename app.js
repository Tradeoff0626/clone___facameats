const express = require('express');
const nunjucks = require('nunjucks');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');  //npm install cookie-parser.

const flash = require('connect-flash');         //npm install connect-flash. flash 메시지 출력용

//passport 관련
const passport = require('passport');           //npm install passport.
const session = require('express-session');     //npm install express-session.

// db 관련
const db = require('./models');


class App {

    constructor () {
        this.app = express();

        // db 접속
        this.dbConnection();
        
        // 뷰엔진 셋팅
        this.setViewEngine();

        //세션 설정
        this.setSession();

        // 미들웨어 셋팅
        this.setMiddleWare();

        // 정적 디렉토리 추가
        this.setStatic();

        // 로컬 변수
        this.setLocals();

        // 라우팅
        this.getRouting();

        // 404 페이지를 찾을수가 없음
        this.status404();

        // 에러처리
        this.errorHandler();


    }

    dbConnection(){
        // DB authentication
        db.sequelize.authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
            //return db.sequelize.sync();
            //return db.sequelize.drop();       //sequelize 재적용 시 삭제 후 재생성. (데이터 제거됨. 새 필드 추가시 migration으로 해야함.)
        })
        .then(() => {
            console.log('DB Sync complete.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
    }


    setMiddleWare (){
        
        // 미들웨어 셋팅
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(cookieParser());                                //CSRF 활용 용도
    }

    setViewEngine (){

        nunjucks.configure('template', {
            autoescape: true,
            express: this.app
        });

    }


    setSession (){

        //npm i --legacy-peer-deps connect-session-sequelize   
        //npm7에서 의존성 검사가 엄격하므로 npm6로 검사(npx -p npm@6 npm install ~)하거나 위 옵션을 설정하여 설치  
        const SequelizeStore = require('connect-session-sequelize')(session.Store);

        //session 관련 셋팅
			//this.app.use(session({
            this.app.sessionMiddleWare = session({      //socket.io의 미들웨어에 적용하기 위해 변수로 따로 설정
				secret: 'tradeoff',         //시크릿 코드. 임의의 값 입력 -> 세션 암호화 처리
				resave: false,              //항상 재저장 할지 여부
				saveUninitialized: true,    //초기화하지 않고 저장할지 여부
				cookie: {                   //쿠키 설정
					maxAge: 2000 * 60 * 60  //지속시간 2시간
				},
                //store : xxx               //세션 데이터 저장 방식. 생략 시 Memort store (파일 저장등 서버 재시작시 reset)
                store : new SequelizeStore({            //session 테이블 생성(DB 세션 사용)
                    db: db.sequelize
                })
			//}));
            });

            //변수로 설정한 세션 정보를 미들웨어로 적용
            this.app.use(this.app.sessionMiddleWare);

			//passport 적용
			this.app.use(passport.initialize());
			this.app.use(passport.session());

			//플래시 메시지 관련
			this.app.use(flash());

    }


    setStatic (){
        this.app.use('/uploads', express.static('uploads'));
        this.app.use('/static', express.static('static'));
    }

    setLocals(){

        // 템플릿 변수
        this.app.use( (req, res, next) => {
            this.app.locals.isLogin = req.isAuthenticated;      //로그인 상태 여부('isAuthenticated'는 passport에서 지원)
            this.app.locals.currentUser = req.user;             //로그인된 사용자 정보
            this.app.locals.req_path = req.path;
            this.app.locals.req_query = req.query;              //홈화면 거리순 정렬을 위해 설정 

            //카카오 지도 API 키 ('.env'에서 설정값 참조)
            this.app.locals.map_api = {
                KAKAO_JAVASCRIPT_KEY : process.env.KAKAO_JAVASCRIPT_KEY,
                default :{                                      //default 위치
                    lat : process.env.DEFAULT_LATITUDE ,        //위도  
                    lng : process.env.DEFAULT_LONGITUDE         //경도
                }
            }

            next();
        });

    }

    getRouting (){
        this.app.use(require('./controllers'))
    }

    status404() {        
        this.app.use( ( req , res, _ ) => {
            res.status(404).render('common/404.html')
        });
    }

    errorHandler() {

        // this.app.use( (err, req, res,  _ ) => {
        //     res.status(500).render('common/500.html')
        // });
    
    }

}

module.exports = new App().app;