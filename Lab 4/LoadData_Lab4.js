function dataByDate() {
    function dataSelection(c) {
        return d => {
            return {
                date: formatDate_data(new Date(d.date)),
                symbol: d.symbol,
                value: d.high,
                volume: +d["Volume USDT"],
                tradecount: +d.tradecount,
                marketcap: +d.high * +c.filter(function (cs) {
                    return cs.Symbol === d.symbol
                })[0].circulation
            };
        };
    }

    return d3.csv('Coin_circulation.csv').then(function (c) {
        return Promise.all([
            d3.csv('data/Binance_ADAUSDT_d.csv', dataSelection(c)),
            d3.csv('data/Binance_BNBUSDT_d.csv', dataSelection(c)),
            d3.csv('data/Binance_BTCUSDT_d.csv', dataSelection(c)),
            d3.csv('data/Binance_BTTUSDT_d.csv', dataSelection(c)),
            d3.csv('data/Binance_DASHUSDT_d.csv', dataSelection(c)),
            d3.csv('data/Binance_DOGEUSDT_d.csv', dataSelection(c)),
            d3.csv('data/Binance_EOSUSDT_d.csv', dataSelection(c)),
            d3.csv('data/Binance_ETCUSDT_d.csv', dataSelection(c)),
            d3.csv('data/Binance_ETHUSDT_d.csv', dataSelection(c)),
            d3.csv('data/Binance_LINKUSDT_d.csv', dataSelection(c)),
            d3.csv('data/Binance_LTCUSDT_d.csv', dataSelection(c)),
            d3.csv('data/Binance_NEOUSDT_d.csv', dataSelection(c)),
            d3.csv('data/Binance_QTUMUSDT_d.csv', dataSelection(c)),
            d3.csv('data/Binance_TRXUSDT_d.csv', dataSelection(c)),
            d3.csv('data/Binance_XLMUSDT_d.csv', dataSelection(c)),
            d3.csv('data/Binance_XMRUSDT_d.csv', dataSelection(c)),
            d3.csv('data/Binance_XRPUSDT_d.csv', dataSelection(c)),
            d3.csv('data/Binance_ZECUSDT_d.csv', dataSelection(c))
        ])
            .then(([ADA, BNB, BTC, BTT, DASH, DOGE, ETH, LTC, NEO, XRP, LINK, EOS, TRX, ETC, XLM, ZEC, QTUTM, XMR]) => {
                let total_data = ADA.concat(BNB, BTC, BTT, DASH, DOGE, ETH, LTC, NEO, XRP, LINK, EOS, TRX, ETC, XLM, ZEC, QTUTM, XMR);
                min_date = d3.min(total_data.map(d => d.date));
                max_date = d3.max(total_data.map(d => d.date));
                let grouped = groupbyDate(total_data, "date");
                return grouped
            });
    })
}

/*
Allows grouping data together by key separating objects in array
 */
function groupbyDate(array, key) {
    // Return the reduced array
    return array.reduce((result, currentItem) => {
        // If an array already present for key, push it to the array. Otherwise create an array and push the object.
        (result[currentItem[key]] = result[currentItem[key]] || []).push(currentItem);
        // return the current iteration `result` value, this will be the next iteration's `result` value and accumulate
        return result;
    }, {}); // Empty object is the initial value for result object
}

function dataByCoin() {
    function dataSelection(c) {
        return d => {
            return {
                date: formatDate_data(new Date(d.date)),
                symbol: d.symbol,
                value: d.high,
                volume: +d["Volume USDT"],
                tradecount: +d.tradecount,
                marketcap: +d.high * +c.filter(function (cs) {
                    return cs.Symbol === d.symbol
                })[0].circulation
            };
        };
    }

    return d3.csv('Coin_circulation.csv').then(function (c) {
        return Promise.all([
            d3.csv('data/Binance_ADAUSDT_d.csv', dataSelection(c)),
            d3.csv('data/Binance_BNBUSDT_d.csv', dataSelection(c)),
            d3.csv('data/Binance_BTCUSDT_d.csv', dataSelection(c)),
            d3.csv('data/Binance_BTTUSDT_d.csv', dataSelection(c)),
            d3.csv('data/Binance_DASHUSDT_d.csv', dataSelection(c)),
            d3.csv('data/Binance_DOGEUSDT_d.csv', dataSelection(c)),
            d3.csv('data/Binance_EOSUSDT_d.csv', dataSelection(c)),
            d3.csv('data/Binance_ETCUSDT_d.csv', dataSelection(c)),
            d3.csv('data/Binance_ETHUSDT_d.csv', dataSelection(c)),
            d3.csv('data/Binance_LINKUSDT_d.csv', dataSelection(c)),
            d3.csv('data/Binance_LTCUSDT_d.csv', dataSelection(c)),
            d3.csv('data/Binance_NEOUSDT_d.csv', dataSelection(c)),
            d3.csv('data/Binance_QTUMUSDT_d.csv', dataSelection(c)),
            d3.csv('data/Binance_TRXUSDT_d.csv', dataSelection(c)),
            d3.csv('data/Binance_XLMUSDT_d.csv', dataSelection(c)),
            d3.csv('data/Binance_XMRUSDT_d.csv', dataSelection(c)),
            d3.csv('data/Binance_XRPUSDT_d.csv', dataSelection(c)),
            d3.csv('data/Binance_ZECUSDT_d.csv', dataSelection(c))
        ])
            .then(([ADA, BNB, BTC, BTT, DASH, DOGE, ETH, LTC, NEO, XRP, LINK, EOS, TRX, ETC, XLM, ZEC, QTUTM, XMR]) => {
                let total_data = ADA.concat(BNB, BTC, BTT, DASH, DOGE, ETH, LTC, NEO, XRP, LINK, EOS, TRX, ETC, XLM, ZEC, QTUTM, XMR);
                min_date = d3.min(total_data.map(d => d.date));
                max_date = d3.max(total_data.map(d => d.date));
                let grouped = groupbyDate(total_data, "symbol");
                return grouped
            });
    })
}