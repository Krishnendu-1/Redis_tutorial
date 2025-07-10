import redis from 'redis';//it is used to connect to redis server

const client = redis.createClient({
    host: 'localhost', // Redis server host
    port: 6379, // Redis server port
});


client.on('error', (err) => {
    console.error('Redis error:', err);
});


async function connectRedis() { 

    try {
        await client.connect();
        console.log("Connected to Redis server");
        const setVal=await client.set("Key","Krishna")
        console.log("Value set in Redis:");
        const getVal=await client.get("Key");
        console.log("Value retrieved from Redis:", getVal);
        const delVal=await client.del("Key");
        console.log("Value deleted from Redis:", delVal);

        await client.set("counter", 50);
        const increment=await client.incr("counter");
        console.log("Counter incremented by 1:", increment);
        await client.set("counter", 50);
        const decrement=await client.decr("counter");
        console.log("Counter decreamented by 1:", decrement);
         

        
    } catch (error) {
        console.log("redis connection error", error);
        
    }finally {
        // Ensure the client is disconnected when the process exits
        await client.quit();
    }


}


connectRedis();