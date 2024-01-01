import { createClient } from 'redis';

export const client = createClient();

client.on('error', (err) => {
  console.log('Redis client Error ', err);
});
(async function () {
  await client.connect();
  console.log('Redis connected successful');
})();

export const redisCheckName = async (name: string) => {
  return await client.get(name);
};

export const redisSet = async (name: string, value: any, expiration = 60) => {
  client.set(name, value, { EX: expiration });
};
