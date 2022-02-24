const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://203.249.22.47:8000");
const mysql = require("mysql");
var id;
const rakhyun = "17917915513";
const sangmin = "9918322518";
const heechan = "3520137153";
const anna = "672002012";
const yejin = "1967222152";

client.on("connect", () => {
  console.log("mqtt connected");
  client.subscribe("card");
});

client.on("error", (err) => {
  console.log(err);
  client.end();
});

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
    var sql = `SELECT MAX(id) AS max_id FROM comments`;
    con.query(sql, (err, result) => {
      if (err) {
        return console.log(err, " - query");
      } else {
        id = result[0].max_id;
        console.log("id is " + id);
      }
    });
    client.on("message", (topic, message) => {
      var card_id = message.toString(); //메시지 내용은 카드 번호
      var content;
      console.log(card_id);
      id++;
      switch (card_id) {
        case "17917915513":
          content = "Rakhyun IN";
          console.log("Rakhyun IN");
          break;
        case "9918322518":
          content = "Sangmin IN";
          break;
        case "3520137153":
          content = "Heechan IN";
          break;
        case "672002012":
          content = "Anna IN";
          break;
        case "1967222152":
          content = "Yejin IN";
          break;
        default:
          console.log("not found user");
      }
      dbQuery(id, content);
    });
  }
});

function dbQuery(id, content) {
  var sql_insert = `INSERT INTO comments(id,post_id,user_id, content) VALUES(${id},292,99,"${content}")`;
  // id 는 댓글을 구분하는 속성이라 댓글을 달 때마다 변경시켜야 하고 , 출퇴근 기록 게시판에 댓글을 남기기 위해서는 post_id = 292로 설정, user_id는 댓글을 작성할 작성자 id 번호
  con.query(sql_insert, (err, result) => {
    if (err) {
      return console.log(err, " - query");
    } else {
      console.log("data insert success !");
    }
  });
}
