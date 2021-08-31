const currencyhelper = require("./currencyhelper");
const { Telegraf } = require('telegraf');
const bot = new Telegraf('<TOKEN>');

let isRunning = false;

currencyhelper.emitter.on("currency", function() {
    if(!isRunning) {
        isRunning = true;
        console.log("Bot running...");
        bot.launch();
    }
});

currencyhelper.getCurrencies();

let chats = [];
let lastMessage = {};
setInterval(updateCurrencies, 3600000);

bot.start((ctx) => {
    if(!containsChat(ctx.chat.id)) {
        chats.push(ctx.chat);
    }
    ctx.reply('Hi! Write command /get').then((m) => {
        lastMessage[ctx.chat.id] = m.message_id;
    });
});

bot.hears('/get', (ctx) =>{
    let message = `CURRENCY NAME | CHAR CODE | RATE (base RUB)\n${'-'.repeat(90)}\n`;
    currencyhelper.currencies.forEach(currency=>
        {
            message +=`${currency.name} | ${currency.charcode} | ${currency.rate}\n`;
        });
    ctx.reply(message)
});

function updateCurrencies(){
     currencyhelper.getCurrencies();
}

function containsChat(id) {
    for(let chat of chats){
        if(chat.id == id) {
            return true;
        }
    }
    return false;
}

