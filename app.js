const dotenv = require('dotenv').config();
const fetch = require("node-fetch");
const config = require('./config');
const express = require('express');
const app = express();
const port = process.env.PORT;



// Get Memberd & Houers data from sprint-board
let getMemberd_getHouers = 'query {boards(ids: 671223520){ items { column_values(ids:["people3", "retainer_billing8"]){ text }}}}'

// Get members by they id from Info-board
let getMembersById = 'query {boards(ids:667708556){ items { id name }}}'
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

// Check app conntion
// alert("Hello! Func fan run Now!!");
changeTextIntegrtion();
console.log('none ==>');

function changeTextIntegrtion(){
  console.log('Server is runing on monday app integrtion...');
  let updateFields = 'mutation {change_column_value(board_id: 728270613, item_id: 730680397, column_id: january, value:"12020") {id}}';
 
  query('post', 'query', updateFields);
}
//---------

async function fetchAndMutation() {
  console.log('Server is runing on monday app integrtion...');
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
  empArray = boards[0].items;
  
  let boardInfo = await query('post', 'query', getMembersById)
  let empIds = boardInfo.data.boards[0].items;
  empIds.forEach(item => { newObj[item.name] = item.id }) ;

  empArray.forEach(item => {
    let allMembers = item.column_values[0].text;
    let allhouers = item.column_values[1].text;
    let mutationFields = `mutation {change_column_value(board_id: 667708556, item_id: ${newObj[allMembers]}, column_id: hours_tracked, value:"${allhouers}"){ id }}`;
    query('post', 'query', mutationFields)
  })
};

app.listen(port, () => console.log(`Quickstart app listening at http://localhost:${port}`))

module.exports = app;
//numbers60 - Source coulmn
//january - 2 Salary Base