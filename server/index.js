const keys = require('./keys');

// Express App
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Postgres Setup
const { Pool } = require('pg');

const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});

pgClient.on("connect", (client) => {
  client
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch((err) => console.error(err));
});

// Redis Client Setup
const redis = require('redis');

const redisClient = redis.createClient({
  socket: {
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
  },
});

redisClient.connect();

const redisPublisher = redisClient.duplicate();

redisPublisher.connect();

// Express Api

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * from values');
  res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
  const values = await redisClient.hGetAll('values');
  res.send(values); 
});

app.post('/values', async (req, res) => {
  const index = req.body.index;
  if(parseInt(index) > 40) {
    return res.status(422).send('Index is too high. It should be less than or equal to 40.')
  }

  await redisClient.hSet('values', index, 'Nothing yet !!');
  await redisPublisher.publish('insert', index);

  pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);
  res.send({ working: true});
});

const expressPort = 4000;

app.listen(expressPort, (err) => {
  console.log(`App running on ${expressPort}`);
});
