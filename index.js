"use strict";
const linebot = require("linebot");
const line = require("@line/bot-sdk");
const express = require("express");
const configGet = require("config");
const app = express();
const mysql = require("mysql");
const moment = require("moment");
const google = require("googleapis");
const googleAuth = require("google-auth-library");
const db = mysql.createConnection({
  host: "medical.cg1fvo9lgals.ap-southeast-1.rds.amazonaws.com",
  user: "administrator",
  password: "1qaz2wsx",
  database: "medical"
});
db.connect();

const bot = linebot({
  channelId: "1561441777",
  channelSecret: configGet.get("CHANNEL_SECRET"),
  channelAccessToken: configGet.get("CHANNEL_ACCESS_TOKEN")
});
const linebotParser = bot.parser();

app.post("/webhook", linebotParser, function(req, res) {
  console.log("webhook in");
});

var appointment = {};
var appointment_time = [];
var search = [];

bot.on("message", function(event) {
  console.log(event);
  var userinput = event.message.text;

  if (userinput == "掛號") {
    console.log(appointment.length);
    console.log(event.message.text);
    event.reply({
      type: "template",
      altText: "在不支援顯示樣板的地方顯示的文字",
      template: {
        type: "buttons",
        text: "請問你要掛哪一科?",
        actions: [
          {
            type: "message",
            label: "牙科",
            text: "牙科"
          },
          {
            type: "message",
            label: "胸腔科",
            text: "胸腔科"
          }
        ]
      }
    });
  } else if (userinput == "牙科") {
    appointment.sub = userinput;
    event.reply({
      type: "template",
      altText: "在不支援顯示樣板的地方顯示的文字",
      template: {
        type: "buttons",
        text: "請問你要掛哪一個醫師的診?",
        actions: [
          {
            type: "message",
            label: "黃大旻醫師",
            text: "2019-05-24",
            text: "黃大旻"
          },
          {
            type: "message",
            label: "陳岳澤醫師",
            text: "2019-05-25",
            text: "陳岳澤"
          }
        ]
      }
    });
  } else if (userinput == "胸腔科") {
    appointment.sub = userinput;
    event.reply({
      type: "template",
      altText: "在不支援顯示樣板的地方顯示的文字",
      template: {
        type: "buttons",
        text: "請問你要掛哪一個醫師的診?",
        actions: [
          {
            type: "message",
            label: "邵柏鈞醫師",
            text: "2019-05-24",
            text: "邵柏鈞"
          },
          {
            type: "message",
            label: "廖子淇醫師",
            text: "2019-05-25",
            text: "廖子淇"
          }
        ]
      }
    });
  } else if (
    userinput == "黃大旻" ||
    userinput == "陳岳澤" ||
    userinput == "邵柏鈞" ||
    userinput == "廖子淇"
  ) {
    appointment.doc = userinput;
    appointment_time.push(event.timestamp);
    event.reply({ type: "text", text: "請輸入身分證字號:" });
  } else if (
    userinput.match(/^[A-Z]\d{8,9}$/) &&
    appointment_time.length == 1
  ) {
    appointment.id = userinput;
    event.reply("請輸入預約日期:(西元-月份-日期)");
    appointment_time = [];
  } else if (userinput.match(/\d{4}-\d{2}-\d{2}/)) {
    console.log(appointment);
    console.log("id in");
    appointment.time = userinput;
    db.query(
      "SELECT * FROM `med_basic_info` WHERE `id`=?",
      [appointment.id],
      (error, results, fields) => {
        console.log(results);
        const val = {
          ID: appointment.id,
          Name: results[0].Name,
          Sex: results[0].Sex,
          Subject: appointment.sub,
          APP_TIME: appointment.time,
          Doctor: appointment.doc
        };
        db.query(
          "INSERT INTO `med_appointment_sub` set ?",
          val,
          (error, results, fields) => {
            console.log(results);
          }
        );
      }
    );
    event.reply("掛號成功!若要查看診進度請輸入查詢");
  }
  if (userinput == "查詢") {
    event.reply("請輸入身分證字號:");
  } else if (userinput.match(/^[A-Z]\d{8,9}$/)) {
    appointment.querry = userinput;
    db.query(
      "SELECT * FROM `med_appointment_sub` WHERE `ID`= ?",
      appointment.querry,
      (error, results, fields) => {
        if (results.length == false) {
          console.log("wrong input");
          event.reply("查無資料，請輸入掛號進行預約");
        } else {
          console.log([
            { type: "text", text: "查詢資訊:" },
            { type: "text", text: "醫生:" + results[0].Doctor },
            { type: "text", text: "科別:" + results[0].Subject },
            {
              type: "text",
              text:
                "看診時間:" + moment(results[0].App_time).format("YYYY/MM/DD")
            }
          ]);
          event.reply([
            { type: "text", text: "查詢資訊:" },
            { type: "text", text: "醫生:" + results[0].Doctor },
            { type: "text", text: "科別:" + results[0].Subject },
            {
              type: "text",
              text:
                "看診時間:" + moment(results[0].App_time).format("YYYY/MM/DD")
            }
          ]);
        }
      }
    );
  }
});

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});
