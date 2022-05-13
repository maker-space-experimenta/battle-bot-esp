
#include <Arduino.h>
#include <DNSServer.h>
#include <WiFi.h>
#include <AsyncTCP.h>
#include "ESPAsyncWebServer.h"
#include "ESP32Servo.h"

#include <settings.h>
#include <html.h>

#define pinStandby 2

#define pinPWMA 5
#define pinDirA1 18
#define pinDirA2 19

#define pinPWMB 21
#define pinDirB1 22
#define pinDirB2 23

char *ssid = SSID;
char *password = PASSWD;

DNSServer dnsServer;
AsyncWebServer server(80);
AsyncWebSocket ws("/ws");

int motor_a = 0;
int motor_b = 0;
bool armed = false;

bool clientConnected = false;

class CaptiveRequestHandler : public AsyncWebHandler
{
public:
  CaptiveRequestHandler() {}
  virtual ~CaptiveRequestHandler() {}

  bool canHandle(AsyncWebServerRequest *request)
  {
    return true;
  }

  void handleRequest(AsyncWebServerRequest *request)
  {
    request->send_P(200, "text/html", index_html);
  }
};

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

void setup()
{
  Serial.begin(115200);

  WiFi.mode(WIFI_AP);
  WiFi.softAP(ssid, password);

  ws.onEvent(onEvent);
  server.addHandler(&ws);

  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request)
            {
      request->send_P(200, "text/html", index_html2); 
      Serial.println("Client Connected"); });

  dnsServer.start(53, "*", WiFi.softAPIP());
  server.addHandler(new CaptiveRequestHandler()).setFilter(ON_AP_FILTER);
  server.begin();

  pinMode(pinStandby, OUTPUT);

  pinMode(pinDirA1, OUTPUT);
  pinMode(pinDirA2, OUTPUT);
  pinMode(pinDirB1, OUTPUT);
  pinMode(pinDirB2, OUTPUT);

  disarm();
}

void loop()
{
  dnsServer.processNextRequest();
  AsyncWebSocket::AsyncWebSocketClientLinkedList clients = ws.getClients();

  if (clients.length() > 0)
  {
    if (motor_a > 0)
    {
      int mapped = map(motor_a, 0, 100, 0, 255);

      digitalWrite(pinDirA1, HIGH);
      digitalWrite(pinDirA2, LOW);
      analogWrite(pinPWMA, mapped);
    }
    else if (motor_a < 0)
    {
      int mapped = map(motor_a * -1, 0, 100, 0, 255);

      digitalWrite(pinDirA1, LOW);
      digitalWrite(pinDirA2, HIGH);
      analogWrite(pinPWMA, mapped);
    }
    else
    {
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
    }
    else
    {
      digitalWrite(pinDirB1, LOW);
      digitalWrite(pinDirB2, HIGH);
      analogWrite(pinPWMB, 0);
    }
  }
  else
  {
    disarm();
  }
}