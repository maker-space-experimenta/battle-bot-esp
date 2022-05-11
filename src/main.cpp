
#include <Arduino.h>
#include <WiFi.h>
#include "ESPAsyncWebServer.h"
#include "ESP32Servo.h"

#include <Preferences.h>
#include <WiFi.h>
#include <WiFiClient.h>
#include <WiFiAP.h>

#include <settings.h>

#define pinStandby 2

#define pinPWMA 5
#define pinDirA1 18
#define pinDirA2 19

#define pinPWMB 21
#define pinDirB1 22
#define pinDirB2 23

char *ssid = SSID;
char *password = PASSWD;


AsyncWebServer server(80);
AsyncWebSocket ws("/ws");
String header;

int motor_a = 0;
int motor_b = 0;
bool armed = false;

bool clientConnected = false;

void disarm()
{
  digitalWrite(pinStandby, LOW);
  motor_a = 0;
  motor_b = 0;
  armed = false;
  digitalWrite(pinPWMA, LOW);
  digitalWrite(pinPWMB, LOW);

}

void arm()
{
  digitalWrite(pinStandby, HIGH);
  motor_a = 0;
  motor_b = 0;
  armed = true;
}

void handleWebSocketMessage(void *arg, uint8_t *data, size_t len)
{
  AwsFrameInfo *info = (AwsFrameInfo *)arg;
  if (info->final && info->index == 0 && info->len == len && info->opcode == WS_TEXT)
  {
    data[len] = 0;
    String d = String((char *)data);
    Serial.print("Data: ");
    Serial.println(d);

    if (d.startsWith("motor:"))
    {
      String vals = d.substring(6);
      motor_a = vals.substring(0, vals.indexOf(';')).toInt();
      motor_b = vals.substring(vals.indexOf(';') + 1).toInt();
    }

    if (d.startsWith("disarm:"))
    {
      disarm();
    }

    if (d.startsWith("arm:"))
    {
      arm();
    }
  }
}

void onEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type,
             void *arg, uint8_t *data, size_t len)
{
  switch (type)
  {
  case WS_EVT_CONNECT:
    Serial.printf("WebSocket client #%u connected from %s \n", client->id(), client->remoteIP().toString().c_str());
    break;
  case WS_EVT_DISCONNECT:
    Serial.printf("WebSocket client #%u disconnected \n", client->id());
    break;
  case WS_EVT_DATA:
    handleWebSocketMessage(arg, data, len);
    break;
  case WS_EVT_PONG:
  case WS_EVT_ERROR:
    break;
  }
}

void startWIFI()
{

  // if (!WiFi.config(local_IP, gateway, subnet))
  // {
  //   Serial.println("STA Failed to configure");
  // }

  // WiFi.softAP(wifi_ssid, wifi_passwd);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.println("Connecting to WiFi..");
  }

  // Print ESP32 Local IP Address
  Serial.println(WiFi.localIP());
}

void startServer()
{

  ws.onEvent(onEvent);
  server.addHandler(&ws);

  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->redirect("http://battlebot.hmnd.de?bot=" + WiFi.localIP().toString()); });

  server.on("/metrics", HTTP_GET, [](AsyncWebServerRequest *request)
            { 
              String metrics = R"rawliteral(
{
  "motor_a_speed" : %motor_a_speed%, 
  "motor_b_speed" : %motor_b_speed%,
  "armed": %armed%
}
)rawliteral";

              metrics.replace("%motor_a_speed%", String(motor_a));
              metrics.replace("%motor_b_speed%", String(motor_b));
              metrics.replace("%armed%", String(armed));
              
              request->send(200, "application/json", metrics); });

  server.begin();
}

void startBot()
{
  pinMode(pinStandby, OUTPUT);

  pinMode(pinDirA1, OUTPUT);
  pinMode(pinDirA2, OUTPUT);
  pinMode(pinDirB1, OUTPUT);
  pinMode(pinDirB2, OUTPUT);

  disarm();
}

void setup()
{
  Serial.begin(115200);

  startWIFI();
  startServer();

  startBot();
}

void loop()
{
  AsyncWebSocket::AsyncWebSocketClientLinkedList clients = ws.getClients();

  if (clients.length() > 0)
  {
    // Serial.print("Motor A: ");
    // Serial.print(motor_a);
    // Serial.print(" - ");
    // Serial.print("Motor B: ");
    // Serial.print(motor_b);
    // Serial.println(";");

    if (motor_a > 0)
    {
      int mapped = map(motor_a, 0, 100, 0, 255);
      // Serial.print("run motor a clockwise - ");
      // Serial.println(mapped);

      digitalWrite(pinDirA1, HIGH);
      digitalWrite(pinDirA2, LOW);
      analogWrite(pinPWMA, mapped);
      // digitalWrite(pinPWMA, HIGH);

    }
    else if (motor_a < 0)
    {
      int mapped = map(motor_a * -1, 0, 100, 0, 255);
      // Serial.println("run motor a counterclockwise - ");
      // Serial.println(mapped);

      digitalWrite(pinDirA1, LOW);
      digitalWrite(pinDirA2, HIGH);
      analogWrite(pinPWMA, mapped);
      // digitalWrite(pinPWMA, HIGH);

    } else {
      digitalWrite(pinDirA1, LOW);
      digitalWrite(pinDirA2, HIGH);
      analogWrite(pinPWMA, 0);
    }

    if (motor_b > 0)
    {
      int mapped = map(motor_b, 0, 100, 0, 255);
      digitalWrite(pinDirB1, HIGH);
      digitalWrite(pinDirB2, LOW);
      analogWrite(pinPWMB, mapped);
    }
    else if (motor_b < 0)
    {
      int mapped = map(motor_b * -1, 0, 100, 0, 255);

      digitalWrite(pinDirB1, LOW);
      digitalWrite(pinDirB2, HIGH);
      analogWrite(pinPWMB, mapped);
    } else {
      digitalWrite(pinDirB1, LOW);
      digitalWrite(pinDirB2, HIGH);
      analogWrite(pinPWMB, 0);
    }
  }
  else
  {
    disarm();
    // Serial.println("no clients connected");
  }
}