const request = require("request");
const Emitter = require("events");

module.exports.emitter = new Emitter();

module.exports.getCurrencies = function() {
    let codes = [];
    let currencies =[];
    request('https://www.cbr-xml-daily.ru/daily_json.js', function (error, response, body) {
        if(response.statusCode == 200) {
            let cs = JSON.parse(body);
            codes = Object.keys(cs.Valute);
            codes.forEach(code => {
                let currency = [];
                currency.name = cs.Valute[code].Name;
                currency.charcode = cs.Valute[code].CharCode;
                currencies.push(currency);
            });

            request('https://www.cbr-xml-daily.ru/latest.js', function (error, response, body) {
                if(response.statusCode == 200) {
                    let cs = JSON.parse(body);
                    currencies.forEach(currency => {
                        if(cs.rates[currency.charcode]){
                            currency.rate = cs.rates[currency.charcode];
                        }
                        currency.baseCurrency = cs.base;
                    });
                    

                    let baseCurrency = [];
                    baseCurrency.name = "Российский рубль";
                    baseCurrency.charcode = cs.base;
                    baseCurrency.rate = 1.0;
                    baseCurrency.baseCurrency = cs.base;
                    currencies.push(baseCurrency);
                    module.exports.currencies = currencies;
                    module.exports.emitter.emit("currency");
                }else{
                    return;
                }
            });
        }else{
            return;
        }
    });
}