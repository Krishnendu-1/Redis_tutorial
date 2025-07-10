import redis from "redis"

const client = redis.createClient({
    host:'localhost',
    port:6379
})

async function connectRedis() {

try {
    await client.connect()
    console.log("Connected to Redis server");
    //strings-->set,get,mset,mget
    await client.set('name', 'Krishna');
    const getVal = await client.get('name');
    console.log("Value set in Redis:", getVal);
    await client.mSet(['key1', 'value1', 'key2', 'value2']);
    const  [key1,key2]= await client.mGet(['key1','key2']);
    console.log("Multiple values retrieved from Redis:", key1, key2);

    //lists-->lpush,rpush,lpop,rpop,lrange
    await client.lPush('myList', ['item1', 'item2', 'item3']);
    const listItems = await client.lRange('myList', 0, -1);
    console.log("List items:", listItems);

    const lpopItem = await client.lPop('myList');
    console.log("Item popped from the left:", lpopItem);//pop from left

    const rpopItem = await client.rPop('myList');
    console.log("Item popped from the right:", rpopItem);//pop from right   



    //sets-->sadd,srem,smembers,sismember
    await client.sAdd('mySet', ['itemA', 'itemB', 'itemC']);
    const setMembers = await client.sMembers('mySet');
    console.log("Set members:", setMembers);
    const isMember = await client.sIsMember('mySet', 'itemA');
    console.log("Is itemA a member of mySet?", isMember);
    await client.sRem('mySet', 'itemB');
    console.log("itemB removed from mySet");
    const updatedSetMembers = await client.sMembers('mySet');
    console.log("Updated set members:", updatedSetMembers);


    //sorted sets-->zadd,zrem,zrange,zscore,zrank
    await client.zAdd('mySortedSet', [
        { score: 1, value: 'item1' },
        { score: 2, value: 'item2' },
        { score: 3, value: 'item3' }
    ]);
    const sortedSetItems = await client.zRange('mySortedSet', 0, -1);
    console.log("Sorted set items:", sortedSetItems);
    const allitemswithScore= await client.zRangeWithScores('mySortedSet', 0, -1);
    console.log("Sorted set items with scores:", allitemswithScore);

    const itemrank = await client.zRank('mySortedSet', 'item2');
    console.log("Rank of item2 in mySortedSet:", itemrank);
    const itemScore = await client.zScore('mySortedSet', 'item3');  
    console.log("Score of item3 in mySortedSet:", itemScore);



    //hashes-->hset,hget,hdel,hgetall
    await client.hSet('myHash', {
        field1: 'value1',
        field2: 'value2',
        field3: 'value3'
    });
    const hashValue = await client.hGet('myHash', 'field1');
    console.log("Value of field1 in myHash:", hashValue);
    const allHashValues = await client.hGetAll('myHash');
    console.log("All values in myHash:", allHashValues);
    await client.hDel('myHash', 'field2');  
    console.log("field2 deleted from myHash");



} catch (error) {
    client.on('error', (err) => {
        console.error('Redis error:', err);
    });

}finally {
    await client.quit();
    console.log("Redis client disconnected");
}
}

connectRedis();
