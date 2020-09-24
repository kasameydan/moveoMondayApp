const dotenv = require('dotenv').config();
var bodyParser = require('body-parser')
const routes = require('./src/src/routes/mondayRoute')
const express = require('express');
const app = express();
const mondayFunc = require('./src/src/routes/function')
const port = process.env.PORT;


app.use(bodyParser.json())
// app.use('/subrout/',routes);

app.get('/subrout/members_houers', async function (req, res) {
    const result = await mondayFunc.fetchAndMutation();
    res.json(result)
});

app.get('/subrout/testOne', async function (req, res) {
    const result = await mondayFunc.testOne();
    res.json(result)
});



app.listen(port, () => console.log(`Quickstart app listening at http://localhost:${port}`))
module.exports = app;
