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

//底下輸入client_secret.json檔案的內容
var myClientSecret={"installed":{"client_id":"301937700301-moqnki2rg80fgfokld1urbiai12o4o2p.apps.googleusercontent.com","project_id":"sunny-jetty-239408","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"zvVPMg3s_WywXsGLrvVSclrY","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}

var auth = new googleAuth();
var oauth2Client = new auth.OAuth2(myClientSecret.installed.client_id,myClientSecret.installed.client_secret, myClientSecret.installed.redirect_uris[0]);

//底下輸入sheetsapi.json檔案的內容
oauth2Client.credentials ={"access_token":"ya29.Glv9BhApw9q81SgwZlWHEtAANaK94ZDnN3mBCB4Aowz6t5sZBECrlvmvsexRaIyh4v-28YOGj1gmWvzyBuoyC5r43atLcaeHWP8WazAD93ZLEinuN06SPczmsxGa","refresh_token":"1/P-XYiLeyOedrTzD_AKHRVMFX_rV3yERSb4wi4_14-ks","scope":"https://www.googleapis.com/auth/spreadsheets.readonly","token_type":"Bearer","expiry_date":1556813212607}

//試算表的ID，引號不能刪掉
var mySheetId='1iqZWdfswYPzuAiXt5iren_zWndUqeLk5s3G76lwH-zY';

app.post('/webhook', linebotParser, function (req, res) {
    console.log('webhook in')
});

var appointment = [];
var search = [];

bot.on('message', function (event) {
    var userinput = event.message.text;
    if (event.message.text == '查詢') {
        search.push(event.timestamp)
        console.log(search.length)
        console.log(event.message.text);
        event.reply({ type: 'text', text: '請輸入身分證已進行查詢: ' })
    }else if(userinput.match(/^[A-Z]\d{9}$/)&& search.length>=1){
        db.query("SELECT * FROM `med_appointment_sub` WHERE `ID`= ?", [event.message.text], (error, results, fields) => {
            if (results.length == false) {
                event.reply({ type: 'text', text: '輸入錯誤' });
            }
            else {
                console.log(results[0])
                console.log(results[0].Doctor);
                event.reply({type:''})
                event.reply([{type: 'text', text: '掛號資訊:'},{ type: 'text', text: '醫生:'+results[0].Doctor},{type: 'text', text: '科別:'+results[0].Subject},{type: 'text', text: '看診時間:'+moment(results[0].App_time).format('YYYY/MM/DD hh:mm')},{type:'text',text:'查詢成功'}]);
            }
        });
        search=[]
        console.log(search.length)
    }
    if (userinput == '掛號') {
        appointment.push(event.timestamp)
        console.log(appointment.length)
        console.log(event.message.text)
        event.reply({ type: 'text', text: '請問你要掛哪一科?請輸入牙科或胸腔科' });
    }else if(userinput=='牙科'||userinput=='胸腔科'){
        event.reply({type:'text',text:'請輸入身分證字號、姓名、科別、預約時間以進行掛號:'})
    }else if(userinput.match(/^[A-Z]\d{9}$/) && appointment.length>=1 ){
        db.query("SELECT ID,Name,Subject,APP_time FROM `med_appointment_sub` WHERE `ID`= ?", [event.message.text], (error, results, fields) => {
            if (results.length == true) {
                event.reply({ type: 'text', text: '你有已掛號的紀錄，請輸入查詢以檢視相關資訊' });
            }
            else if(results.length == false){
                event.reply({type:'text',text:'請依序輸入:1.身分證2.姓名3.性別4.科別5.預約時間6.醫生'});
        
                db.query("INSERT INTO `med_appointment_sub` set=?",{ID:event.message.text,Name:event.message.text,Sex:event.message.text,Subject:event.message.text,App_time:event.message.text,Doctor:event.message.text})
                
            } 
        });
        appointment=[]
        console.log(appointment.length)
    }

});


//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});



