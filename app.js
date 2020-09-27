const dotenv = require('dotenv').config();
var bodyParser = require('body-parser')
const express = require('express');
const app = express();
const mondayFunc = require('./controllers/function')
const port = process.env.PORT;
const CronJob = require('cron').CronJob;


app.use(bodyParser.json())


const displayQueryHourly = new CronJob('0 * * * *', async() => {
    await mondayFunc.fetchAndMutation();
}, null, true);
displayQueryHourly.start();


app.post('/hoursTracked', async (req, res) => {
    const result = await mondayFunc.fetchAndMutation();
    res.json(result)
});


app.listen(port,()=> console.log(`App listening at PORT :${port}`))
module.exports = app;
