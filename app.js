//mqtt 서버에서 발행된 rfid 카드 정보를 nodejs 로 읽어오기, mqtt의 topic은 card

const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://203.249.22.49");
const mysql = require("mysql");

// client.on("connect", () => {
//   console.log;
//   client.subscribe("card");
// });

// client.on("message", (topic, message) => {
//   var obj = JSON.parse(message);  //메시지 내용은 카드 번호
//   console.log(obj);
// });

var con = mysql.createConnection({
  host: "203.249.22.237",
  port: "8888",
  user: "root",
  password: "dkdldpafnxm",
  database: "smart-iot-lab-web",
});

con.connect((err) => {
  if (err) {
    return console.log(err);
  } else {
    console.log("MySql connected");
    var date = new Date();
    var sql =
      "INSERT INTO comments(id,post_id,user_id, content) VALUES(6,292,108,'kim 출근')";
    // id 는 댓글을 구분하는 속성이라 댓글을 달 때마다 변경시켜야 하고 , 출퇴근 기록 게시판에 댓글을 남기기 위해서는 post_id = 292로 설정, user_id는 댓글을 작성할 작성자 id 번호
    con.query(sql, (err, result) => {
      if (err) {
        return console.log(err, " - query");
      } else {
        console.log("data insert success !");
      }
    });
  }
});
