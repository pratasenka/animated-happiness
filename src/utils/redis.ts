import { createClient } from 'redis';

if (!process.env.REDIS_URI) {
    console.error('Error: REDIS_URI is not set.');
    process.exit(1);
}
const redisURI = process.env.REDIS_URI;

const redisClient = createClient({
    url: redisURI
});
void redisClient.connect();

export default redisClient;