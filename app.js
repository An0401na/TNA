var express = require("express");

var http = require("http");

var app = express(); //express 서버 객체

//app 에 임의의 문자열인 port 로 속성을 세팅함
//환경 변수에 PORT 를 설정했다면 그것을 포트로 그렇지 않으면 3000 으로 포트 번호를 express 에 세팅함
app.set("port", 8000);
//속성을 set 으로 설정하고 get 으로 가져올 수 있다

//미들웨어 등록(미들웨어 == 함수)
app.use(
  //http 에서 제공되는 모듈에서 express 에 필요한것이 추가된 것을 파라미터 req, res 로 전달된다
  //req : request 객체
  //res : response 객체
  function (req, res, next) {
    console.log("middle wared was called : first");

    //객체에 멤버 추가
    req.user = "to next Middleware";

    next(); //next를 실행하면 그다음 미들웨어가 받아서 처리하게 됨
    //이때 req, res 를 넘겨준다
  }
);

//그다음 미들웨어 등록
//첫번째 미들웨어로부터 req, res 를 받게 받아서 처리하게 된다
//첫번째 미들웨어의 것을 두번째 미들웨어서 받아서 처리하게 된다
app.use(function (req, res, next) {
  console.log("middle wared was called : second");

  //[1 번째 방법]
  //이때 응답을 보낸다

  //   res.writeHead(
  //     200, //정상 응답
  //     { "Content-Type": "text/html;characterset=utf-8" } //문서를 html 형과 해당 문자 캐릭터 셋으로 보냅
  //   );
  //   res.end("<h1> response from server first </h1>" + req.user); // 전송함

  //[2 번째 방법]
  var val = [
    {
      id: 123,
      title: "aaaaaab",
    },
  ];
  //writeHead, end 를 한번에 send, 그리고 객체를 보낼 수가 있음
  //객체를 넘길대는 json 포멧으로 넘어감

  //   res.send(val);

  //[3 번째 방법]
  //val 객체를 json 문자로 바꿔 전송 가능

  // var jsonDatas = JSON.stringify(val);
  // res.send(jsonDatas);

  //[4 번째 방법]
  var jsonDatas = JSON.stringify(val);
  //문서 자체를 json 으로 보내는 방법
  res.writeHead(
    200, //정상 응답
    { "Content-Type": "application/json;characterset=utf-8" } //문서를 json 타입으로 보냄
  );
  res.write(jsonDatas);
  res.end(); // 전송함
});

//웹서버를 app 기반으로 생성
var appServer = http.createServer(app);
appServer.listen(app.get("port"), function () {
  console.log("express 웹서버 실행" + app.get("port"));
});
