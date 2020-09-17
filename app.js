const mondayData = require('./libs/monday');
const fetch = require("node-fetch");
const config = require('./config');


// Get Memberd & Houers data from sprint-board
let getMemberd_getHouers = 'query{boards(ids: 671223520){ items { column_values(ids:["people3", "retainer_billing8"]){ text }}}}'

// Get members by they id from Info-board
let getMembersById = 'query{ boards(ids:667708556){ items { id name }}}'
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

fetchAndMutation()

async function fetchAndMutation() {
  let response = await query('post', 'query', getMemberd_getHouers);
  boards = response.data.boards;

  const newItems = boards[0].items.reduce(function (lastValue, item) {
    const idx = lastValue.findIndex(lastItem => lastItem.column_values[0].text === item.column_values[0].text)
    if (idx !== -1) {
      const sum = Number(lastValue[idx].column_values[1].text) + Number(item.column_values[1].text)
      lastValue[idx].column_values[1].text = String(sum);
      return lastValue;
    } else {
      lastValue.push(item)
      return lastValue;
    }
  }, [])
  boards[0].items = newItems;


  // add id to each employee:
  let empArray = [];
  newObj = {};
  empArrAY = boards[0].items;

  let boardInfo = await query('post', 'query', getMembersById)
  let empIds = boardInfo.data.boards[0].items;

  empIds.forEach(item => { newObj[item.name] = item.id }) ;

  empArray.forEach(item => {
    let allMembers = item.column_values[0].text;
    let allhouers = item.column_values[1].text;
    let mutationFields = `mutation {change_column_value(board_id: 667708556, item_id: ${newArray[allMembers]}, column_id: hours_tracked, value:"${allhouers}") {id}}`;

    query('post', 'query', mutationFields)
  })
};