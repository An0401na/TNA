#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <SPI.h>
#include <MFRC522.h> //카드 태그 
#define SS_PIN 4
#define RST_PIN 0
MFRC522 rfid(SS_PIN, RST_PIN);
MFRC522::MIFARE_Key key; 



byte nuidPICC[4];  //카드  id 임시 저장 배열

const char* ssid = "";
const char* password = "";
const char* mqtt_server = "";
const char* clientName ="";

WiFiClient espClient;
PubSubClient client(espClient);
long lastMsg =0;
char msg[50]


void setup_wifi() {
  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to........ ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);  // 와이파이 접속 시도

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());


}

void reconnect() {  //mqtt 에 재연결 시도
while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");

    if (client.connect(clientName)) {
      Serial.println("connected");
      client.publish("test", "hello world");   //mqtt 서버 쪽으로 문자열을 보냄  이 문자열은 정상적으로 작동되면 pc에 떠야함.
      client.subscribe("inTopic");    //pc에서 inTopic과 함께 데이터를 보내면 데이터를 볼 수 있음 
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);  // 연결이 될때까지 5초마다 재 동작
    }
  }
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  SPI.begin(); // rfid 사용하기 위한 spi 통신 시작
  rfid.PCD_Init(); //rfid 초기화
  for(byte i =0; i<6; i++) {
    key.keyByte[i] = 0xFF; // 카드 id 문자열 형식 맞추기
  }

  setup_wifi();
  client.setServer(mqtt_server, 1883);



}

void loop() {
  // put your main code here, to run repeatedly:
  if(!client.connected()) {
    reconnect();
  }
  client.loop();

  //새 카드가 찍힐 때만 넘어감
  if(!rfid.PICC_IsNewCardPresent()){
    return;
  }
  //카드가 제대로 읽히면 넘어감
  if(rfid.PICC_ReadCardSerial()){
    //찍힌 카드의 아이디UID 값 저장
    for(byte i=0; i<4;i++){
    nuidPICC[i] = rfid.uid.uidByte[i];
    }

    Serial.println("The NUID tag is : ");
    printHex(rfid.uid.uidByte, rfid.uid.size);    // ??16진수로 바꾼걸 값을 담아야해
    Serial.println();
    
    client.publish("card","11111"); //16 진수로 바꾼 값..을 넣어야해
  }else {
    return;
  }

}

//?? 16진 값으로 변환...해서 출력하는 거 말고 변수에 담는 걸로 바꿔보기
void printHex(byte *buffer, byte bufferSize) {
  for (byte i = 0; i < bufferSize; i++) {
    Serial.print(buffer[i] < 0x10 ? " 0" : " ");
    Serial.print(buffer[i], HEX);
  }
}
