const {Client,LocalAuth}=require('whatsapp-web.js');
const GroupChat=require("whatsapp-web.js/src/structures/GroupChat.js");
const client=new Client({
    puppeteer:{
    headless:true
    },
    webVersionCache: {
      type: "remote",
      remotePath:
        "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
    },
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ],
    executablePath: '/bin/chromium-browser',
    authStrategy: new LocalAuth({
        clientId:'MAIN_CLIENT_ON_SERVER_2'
    })
})
client.on('qr',(qr)=>{
  console.log("scan me",qr)
})
client.on("ready",async ()=>{
 console.log('Client is ready')

})
const innitialize=()=>{client.initialize()}
const sendToMessage=(chatid,message)=>{
  const chatId = chatid.substring(1) + "@c.us";
   client.sendMessage(chatId, message);
}

const sendToGroup= async (message)=>{
  let chatid='120363195256816465@g.us';
  client.sendMessage(chatid,message);
}


 module.exports={sendToMessage,sendToGroup,innitialize}