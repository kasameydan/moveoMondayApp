const fetch = require("node-fetch");
const config = require('../config');
const mailgun = require("mailgun-js");


// Get members,hours,teams,date from sprint-board
let getMembersHouersDatePms = 'query {boards(ids: 671223520){ items { column_values(ids:["people3","retainer_billing8","people_assing4","date"]){ text }}}}'


async function query(method, queryType, queryString) {
    return fetch("https://api.monday.com/v2", {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': config.api_key
        },
        body: JSON.stringify({
            [queryType]: queryString
        })
    })
        .then(res => res.json())
        .then(res => res);
}

fetchAndMaillPms();

async function fetchAndMaillPms() {
    let day = new Date()
    let currentDate = day.toISOString().split('T')[0]
    let response = await query('post', 'query', getMembersHouersDatePms);
    boards = response.data.boards;
    const newItems = boards[0].items.reduce(function (lastValue, item) {
        const idx = lastValue.findIndex(lastItem => lastItem.column_values[0].text === item.column_values[0].text)
        if (item.column_values[2].text != currentDate) {
            return lastValue
        }
        if (idx !== -1) {
            const sum = Number(lastValue[idx].column_values[3].text) + Number(item.column_values[3].text)
            lastValue[idx].column_values[3].text = String(sum);
            return lastValue;
        } else {
            lastValue.push(item)
            return lastValue;
        }
    }, [])

    // boards[0].items = newItems;
    // console.log('boards data ==> ', JSON.stringify(newItems, null, 2));
}



emailsArray = ['meydank@moveo.co.il', 'meydank@moveo.co.il', 'itzshak100@gmail.com', 'gizachew.ajigo@gmail.com']
async function sendMail() {
    const domain = 'moveodevelop.com';
    const api_Key = 'key-5a8b594f54f98eea6ed02c3424ce70b3';
    const mg = mailgun({ apiKey: api_Key, domain: domain });
    const data = {
        from: 'Moveo <kasameydan@gmail.com>',
        to: 'kasameydan@gmail.com',
        subject: 'Testing11',
        text: 'Testing11 some Mailgun !!!!'
    };
    mg.messages().send(data, function (error, body) {
        console.log('body :', body);
        if (error) console.log('error :', error);
    });
}

module.exports = { fetchAndMaillPms, sendMail };

