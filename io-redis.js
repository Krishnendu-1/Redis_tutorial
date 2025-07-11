import Redis from "ioredis";//redis client for Node.js

const connectClient = new Redis();

async function connectRedis() {     
    try {
        await connectClient.connect();
        console.log("Connected to Redis server");

        // Example of setting and getting a value
        await connectClient.set("Key", "Krishna");
        console.log("Value set in Redis:");
        const getVal = await connectClient.get("Key");
        console.log("Value retrieved from Redis:", getVal);

    }catch (error) {
        console.log("Redis connection error", error);
    }finally {
        // Ensure the client is disconnected when the process exits
        await connectClient.quit();
        console.log("Redis client disconnected");
    }   }

connectRedis()