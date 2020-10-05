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

async function fetchAndMaillPms() {
  const MEYDAN = 'meydank@moveo.co.il'
  let day = new Date()
  let currentDate = day.toISOString().split('T')[0]
  let response = await query('post', 'query', getMembersHouersDatePms);
  boards = response.data.boards;
  const newItems = boards[0].items.reduce(function (lastValue, item) {
    const idx = lastValue.findIndex(lastItem => lastItem.column_values[0].text === item.column_values[0].text)
    if (item.column_values[3].text != currentDate) {
      return lastValue
    }
    if (idx !== -1) {
      const sum = Number(lastValue[idx].column_values[2].text) + Number(item.column_values[2].text)
      lastValue[idx].column_values[2].text = String(sum);
      return lastValue;
    } else {
      lastValue.push(item)
      return lastValue;
    }
  }, [])
  boards[0].items = newItems;
  console.log('newItems ===>', JSON.stringify(newItems, null, 2));

  const teams = {};
  ecoNames = []
  ecoHouers = []
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
        //  sendMail(html, MEYDAN);
        //  sendMail(html, 'carmel@moveo.co.i');
        break;
      case 'HLS':
        //  sendMail(html, MEYDAN);
        //  sendMail(html, 'mika@moveo.group');
        break;
      case 'Fox':
        // sendMail(html, 'oren@moveo.co.il');
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


//TODO: lopp on 'teams' inside tbody
  function generateHTML(teamNameY) {
    debugger
    let members = teams[teamNameY][0]['column_values'][0].text;
    let houers = teams[teamNameY][0]['column_values'][2].text;
    let emailC = ` 
        <h2> ${teamNameY} </h2>
        <table id="our-table">
        <thead>
          <tr>
              <th> Name  </th>
              <th> Hours </th>
          </tr>
        </thead>
        <tbody >
          <tr>
              <td> ${members} </td>
              <td> ${houers}  </td>
          </tr>
        </tbody>
        </table>
        `;
       return emailC;
  }

  console.log('team team', JSON.stringify(teams, null, 2));
}


const emailContent = `<style> #title{
    color:#fff;
    font-weight:500;
    font-size:28px;
    padding:10px;
    border:1px solid #fff;
    background-color: #55608f;
  }
  
  html,body {
    height: 100%;
  }
  
  body {
    margin: 0;
    /* background: linear-gradient(45deg, #49a09d, #5f2c82); */
    font-family: sans-serif;
    font-weight: 100;
  }
  
  .container {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
   table {
    width: 500px;
    border-collapse: collapse;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
  } 
  
  th,td {
    padding: 15px;/
  }
  
  th {
    text-align: left;
  }
  </style>
  
  <div class="container">
  <h1 id="title"> Team {} Daily Houers Report </h1>
  <h3>  Date: {}  </h3>
  <table id="our-table">
    <thead>
      <tr>
        <th> Name  </th>
        <th> Hours Report </th>
      </tr>
    </thead>
    <tbody id="table-body">
    </tbody>
  </table>
</div>`;


// let mYemail = 'meydank@moveo.co.il'
// sendMail(mYemail, template);
async function sendMail(dataTable, mailAdress) {
    const domain = 'moveodevelop.com';
    const api_Key = 'key-5a8b594f54f98eea6ed02c3424ce70b3';
    let mailgun = require('mailgun-js')({ apiKey: api_Key, domain: domain });

    let mail = mailcomposer({
        from: 'Moveo <meydank@moveo.co.il>',
        to: 'meydank@moveo.co.il',
        subject: 'Test20',
        html: dataTable
    });

    mail.build(function (mailBuildError, message) {
        let dataToSend = {
            to: 'meydank@moveo.co.il',
            message: message.toString('ascii')
        };
        mailgun.messages().sendMime(dataToSend, function (sendError, body) {
            if (body) console.log(body);
            if (sendError) {
                console.log(sendError);
                return;
            }
        });
    });
}

module.exports = { fetchAndMaillPms, sendMail };