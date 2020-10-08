const fetch = require("node-fetch");
const config = require('../config');
const mailcomposer = require('mailcomposer');

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

fetchAndMaillPms()
async function fetchAndMaillPms() {
  let day = new Date()
  let currentDate = day.toISOString().split('T')[0]
  let response = await query('post', 'query', getMembersHouersDatePms);
  boards = response.data.boards;

  const newItems = boards[0].items.reduce(function (lastValue, item) {
    const idx = lastValue.findIndex(lastItem => lastItem.column_values[0].text === item.column_values[0].text)
    if (item.column_values[2].text != currentDate ) {
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

  boards[0].items = newItems;
  const teams = {};
  teamNames = []
  teamHouers = []

  newItems.forEach(item => {
    const teamName = item.column_values[1].text
    if (!teams[teamName]) {
      teams[teamName] = []
      teams[teamName].push(item);
    } else {
      teams[teamName].push(item)
    }
  });

  Object.keys(teams).forEach(team => {
    const html = generateHTML(team)
    
    switch (team) {
      case 'Eco':
        //sendMail(html,'meydank@moveo.group');
        //sendMail(html, 'carmel@moveo.co.i');
        break;
      case 'HLS':
        //sendMail(html,'meydank@moveo.group');
        //sendMail(html, 'mika@moveo.group');
        break;
      case 'Fox':
        //sendMail(html, 'oren@moveo.co.il');
        break;
      case 'Charlie':
        // sendMail(html, 'liata@moveo.co.il ');
        break;
      case 'Golf':
        //  sendMail(html, 'aylon@moveo.co.il');
        break;
      default:
        break;
    }
  })


  function generateHTML(teamNameY) {
    teamNames = []
    teamHouers = []
    for (let i = 0; i < teams[teamNameY].length -1; i++) {
      let members = teams[teamNameY][i]['column_values'][0].text;
      let houers = teams[teamNameY][i]['column_values'][3].text;
      teamNames.push(members)
      teamHouers.push(houers)
    }
    let rows;
    teamNames.forEach((member,i) => {
      rows += `<tr><td>${member}</td><td>${teamHouers[i]}</td></tr>`
    }) 

    let newRows = rows.replace('undefined', '')

    const emailContent = `<html>
      <body>
        <style> 
          .title{
            color:#fff;
            font-weight:500;
            font-size:28px;
            padding:10px;
            border:1px solid #fff;
            background-color: #55608f;
          }
          html,body {
            height: 10%;
          } 
          body {
            margin: 0;
            font-family: sans-serif;
            font-weight: 100;
          } 
          .continer{
          table, td, th {  
            border: 1px solid #ddd;
            text-align: left;
            dirltr !important
          }     
          table {
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            border-collapse: collapse;
            width: 100%;
          }        
          th, td {
            padding: 15px;
          }
        }
         </style>
          
          <div class="continer">
            <h1> Team ${teamNameY} Daily Houers Report </h1>
            <h3> Date: ${currentDate}  </h3>
            <table>
              <thead>
                <tr><th> Name </th> <th> Hours Report </th></tr>
              </thead>
              <tbody>
                ${newRows}
              </tbody>
            </table>
          </div>
          </body>
          </html>`;
      return emailContent
    }
}

async function sendMail(dataTable, emailAddress) {
  const domain = 'moveodevelop.com';
  const api_Key = 'key-5a8b594f54f98eea6ed02c3424ce70b3';

  let mailgun = require('mailgun-js')({ apiKey: api_Key, domain: domain });
  let mail = mailcomposer({
    from: 'Moveo monday bot <dev@moveodevelop.com>',
    to: emailAddress,
    subject: 'Daily Hours Update',
    html: dataTable
  });

  mail.build((mailBuildError, message) => {
    let dataToSend = {
      to: emailAddress,
      message: message.toString('ascii')
    };
    mailgun.messages().sendMime(dataToSend, function (sendError, body) {
      if (body) console.log(body);
      if (sendError) {
        console.log(sendError);
        return;
      }
    });
   // if(mailBuildError) console.log('mailBuildError : ' , mailBuildError);
  });
}

module.exports = { fetchAndMaillPms, sendMail };