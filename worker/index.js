const redis = require('redis');
const keys = require('./keys');

const redisClient = redis.createClient({
  socket: {
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
  },
});

redisClient.connect();

const sub = redisClient.duplicate();

sub.connect();

const fib = (index) => {
  if (index < 2) return 1;
  return fib(index-1) + fib(index-2);
};

sub.subscribe('insert', async (message) => {
  await redisClient.hSet('values', message, fib(parseInt(message)));
});