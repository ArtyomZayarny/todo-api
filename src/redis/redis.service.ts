import { injectable } from 'inversify';
import { createClient } from 'redis';

@injectable()
export class RedisService {
  private client: any;

  constructor() {
    this.client = createClient();
    this.connect();
    this.errorListener();
  }

  async errorListener() {
    this.client.on('error', (err: any) => {
      console.log('Redis client Error ', err);
    });
  }

  async connect() {
    await this.client.connect();
    console.log('Redis connected successfully');
  }

  async getName(name: string) {
    return await this.client.get(name);
  }

  async setData(name: string, value: any, expiration = 60) {
    await this.client.set(name, value, { EX: expiration });
  }
}

//export const client = createClient();

// client.on('error', (err) => {
//   console.log('Redis client Error ', err);
// });
// (async function () {
//   await client.connect();
//   console.log('Redis connected successful');
// })();

// export const getName = async (name: string) => {
//   return await client.get(name);
// };

// export const redisSet = async (name: string, value: any, expiration = 60) => {
//   client.set(name, value, { EX: expiration });
// };
