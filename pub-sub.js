//pubnlisher-->send msg-->channel-->subscriber will get


import redis from "redis"

const connectClient=redis.createClient(
    {
        host:'localhost',
        port:6379

    }
)

async function connectRedis(){
    try{
        await connectClient.connect();
        console.log('connection successful');
        
    //subscriber get the message from publisher
        const subscriber= connectClient.duplicate()//it will create a duplicate client but shares the same connection
        await subscriber.connect();//connet to the redis server

        await subscriber.subscribe('new-channel',(channel,message)=>{
            console.log(`the message got by subscriber ${channel}:${message}`);
        })

    //publisher will send the message to the subscriber through the "new-channel" channel
    await connectClient.publish('new-channel',"Hi, Krishnendu here!!");
    await connectClient.publish('new-channel',"Hi, Krishnendu here again!!");

    //need to unsubscribe after a certain time

    await new Promise((resolve,reject)=>setTimeout(resolve,1000))//it will wait 1s before unsubscribe and quit
    await subscriber.unsubscribe();
    await subscriber.quit();//discard the connection




//* Pipelining & transactions */

console.log('Without pipeline')
console.time('no pipline used')
for(let i=0;i<1000;i++) 
    connectClient.set(`user-Key${i}:`,`user-val${i}`)
console.timeEnd('no pipline used')

console.log('With pipeline')
console.time('pipline used')
const pipe= connectClient.multi();
for(let i=0;i<1000;i++) {
    pipe.set(`user-pipeline-Key${i}`,`user-pipeline-val${i}`)//it will take all the commands and execute them in a single request, taking less time
}
await pipe.exec()
console.timeEnd('pipline used')



    } catch (error) {
        connectClient.on('error',(err)=>{
            console.log('redis connection error',err);
        })
        
    }finally{
        await connectClient.quit();
        console.log("connection closed")
    }
}


connectRedis()