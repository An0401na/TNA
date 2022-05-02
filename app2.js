// 모듈 추출
var http = require("http");
var express = require("express");

// 웹 서버 생성
var app = express();

// 변수를 선언합니다.

var items = [
  {
    name: "우유",
    price: "2000",
  },
  {
    name: "홍차",
    price: "5000",
  },
  {
    name: "커피",
    price: "5000",
  },
];

app.all("/data.html", function (request, response) {
  var output = "";
  output += "<!DOCTYPE html>";
  output += "<html>";
  output += "<head>";
  output += "     <title>Data HTML</title>";
  output += "</head>";
  output += "<body>";
  items.forEach(function (item) {
    output += "<div>";
    output += "       <h1>" + item.name + "</h1>";
    output += "       <h2>" + item.price + "</h2>";
    output += "</div>";
  });
  output += "</body>";
  output += "</html>";
  response.send(output);
});
/**************************** 추가된 코드 ****************************
// json data format으로 client에게 보내는 방식
app.all('/data.json',function(request, response){
    // send : 일반 javascript 오브젝트(객체)를 web browser 전송할 때 자동으로 json 형태로 변환하여 넘겨줌
    response.send(items);
});
/********************************************************/

/* 
    1. static 선언 : 'public' folder를 static으로 선언
    static으로 선언하면, node.js가 자동으로
    public folder에 있는 html, image file, css, js등을 인식함

    2. web browser에서 홈페이지 주소만 부르면(http://127.0.0.1:52273)
    web server는 홈페이지 주소에, index.html 등의 기본 파일이 있으면 index.html을 자동 실행함

    3.  http://127.0.0.1:52273/index.html을 실행함
        http://127.0.0.1:52273/product

*/
app.use(express.static("public"));
//app.use(app.router);
// /a에서 /가 root를 의미
//  root URL : http://127.0.0.1:52273
// app.all : app.get, app.post, app.put, app.delete 모두 가능

app.all("/a", function (request, response) {
  response.send("<h1>Page A</h1>");
});

app.all("/b", function (request, response) {
  response.send("<h1>Page B</h1>");
});

app.all("/c", function (request, response) {
  response.send("<h1>Page C</h1>");
});

app.use(function (request, response) {
  response.send("<h1>안녕하세요~!</h1><h2>반갑습니다~!</h2>");
});
// 웹 서버 실행
http.createServer(app).listen(52273, function () {
  console.log("Server running at http://127.0.0.1:52273");
});
