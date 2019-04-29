"use strict";
const linebot = require('linebot');
const util = require("util")
const line = require('@line/bot-sdk');
const express = require("express");
const request = require("request");
const configGet = require('config');
const app = express();
const mysql = require("mysql");
const moment= require("moment")
const db = mysql.createConnection({
    host: "medical.cg1fvo9lgals.ap-southeast-1.rds.amazonaws.com",
    user: "admin",
    password: "12345678",
    database: "medical"
});
db.connect();

const bot = linebot({
    channelId: '1561441777',
    channelSecret: configGet.get("CHANNEL_SECRET"),
    channelAccessToken: configGet.get("CHANNEL_ACCESS_TOKEN")
});
const linebotParser = bot.parser();

app.post('/webhook', linebotParser, function (req, res) {
    console.log('webhook in')
});

var time = [];
<<<<<<< HEAD
var text = [];
=======
>>>>>>> b464a475d083d5fd0e26cbd5e9a62c0740971508

bot.on('message', function (event) {
    if (event.message.text == '查詢') {
        console.log(event.message.text);
        event.reply({ type: 'text', text: '請輸入身分證已進行查詢: ' })
<<<<<<< HEAD
        time.push(event.timestamp)
        console.log(time)
        time = []
        console.log(time)
        // console.log(event)
    }
    if (event.message.text == '掛號') {
        console.log(event.message.text)
        event.reply({ type: 'text', text: '請問你要掛哪一科?請輸入牙科或胸腔科' });
=======
>>>>>>> b464a475d083d5fd0e26cbd5e9a62c0740971508
        console.log(time.push(event.timestamp))
        console.log(time)
        time = []
        console.log(time)
    }
<<<<<<< HEAD
    if (event.message.text == '牙科') {
        console.log(event.message.text)
        event.reply({ type: 'text', text: '請輸入身分證已進行驗證: ' })
=======
    if (event.message.text == '掛號') {
        console.log(event.message.text)
        event.reply({ type: 'text', text: '請問你要掛哪一科?請輸入牙科或胸腔科' });
>>>>>>> b464a475d083d5fd0e26cbd5e9a62c0740971508
        console.log(time.push(event.timestamp))
        console.log(time)
        time = []
        console.log(time)
    }
<<<<<<< HEAD
    if (event.message.text == '胸腔科') {
=======
    if (event.message.text == '牙科') {
>>>>>>> b464a475d083d5fd0e26cbd5e9a62c0740971508
        console.log(event.message.text)
        event.reply({ type: 'text', text: '請輸入身分證已進行驗證: ' })
        console.log(time.push(event.timestamp))
        console.log(time)
        time = []
        console.log(time)
<<<<<<< HEAD
    }
});

bot.on('message', function (event){
    db.query("SELECT * FROM `med_appointment_sub` WHERE `ID`= ?", [event.message.text], (error, results, fields) => {
            text.push(event.message.text)
            console.log(text)
            text=[]
            console.log(text)
            if (results.length == false) {
                event.reply({ type: 'text', text: '請輸入身分證已進行操作' });
            }
            else {
                console.log(results[0])
                console.log(results[0].Doctor);
                event.reply([{type: 'text', text: '掛號資訊:'},{ type: 'text', text: '醫生:'+results[0].Doctor},{type: 'text', text: '科別:'+results[0].Subject},{type: 'text', text: '看診時間:'+moment(results[0].App_time).format('YYYY/MM/DD hh:mm')}]);
                // event.reply({ type: 'text', text: '醫生:'+results[0].Doctor});
            }
        });
})



=======
    }
    if (event.message.text == '胸腔科') {
        console.log(event.message.text)
        event.reply({ type: 'text', text: '請輸入身分證已進行驗證: ' })
        console.log(time.push(event.timestamp))
        console.log(time)
        time = []
        console.log(time)
    }
});




// db.query("SELECT * FROM `med_appointment_sub` WHERE `ID`= ?", [event.message.text], (error, results, fields) => {
//     // console.log(results);
//     if (results.length == false) {
//         console.log('wrong input');
//         event.reply("wrong input");
//     } else {
//         console.log(results[0]);
//         event.reply(JSON.stringify(results[0]));
//     }
// });
>>>>>>> b464a475d083d5fd0e26cbd5e9a62c0740971508


//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
<<<<<<< HEAD
});
=======
});
>>>>>>> b464a475d083d5fd0e26cbd5e9a62c0740971508
