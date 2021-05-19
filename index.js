var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();

require('dotenv').config()

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:root@localhost:5432/salesforce.contact',
  ssl: {rejectUnauthorized: process.env.DATABASE_URL ? true : false }
});

app.set('port', (process.env.PORT || 5000));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public');
app.get('/cool', (req, res) => res.send(cool()))
app.get('/times', (req, res) => res.send(showTimes()))
app.get('/db', async(req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT ID FROM salesforce.contact');
    const results = { 'results': (result) ? result.rows : null};
    res.render('pages/db', results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})
app.get('/', function(request, response) {
  var env = process.env.APP_ENV;
  if (env == 'staging') {
    var envName = 'staging'
  } else if (env == 'production') {
    var envName = 'production'
  } else {
    var envName = 'review app'
  }
  response.render('index.html', { env: envName});
});

app.listen(app.get('port'), function() {
  console.log("Node app running at localhost:" + app.get('port'));
});

module.exports = app

showTimes = () => {
  let result = '';
  const times = process.env.TIMES || 5;
  for(i = 0; i < times; i++){
    result += i + ' ';
  }
  return result;
}