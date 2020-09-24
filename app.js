const dotenv = require('dotenv').config();
var bodyParser = require('body-parser')
const routes = require('./src/src/routes/mondayRoute')
const express = require('express');
const app = express();
const mondayFunc = require('./src/src/routes/function')
const port = process.env.PORT;
const CronJob = require('cron').CronJob;


app.use(bodyParser.json())


const job = new CronJob('0 * * * *', async() => {
    await mondayFunc.fetchAndMutation();
}, null, true);
job.start();



app.post('/subrout/members_houers', async function (req, res) {
    const result = await mondayFunc.fetchAndMutation();
    res.json(result)
});


app.listen(port, () => console.log(`Quickstart app listening at http://localhost:${port}`))
module.exports = app;
