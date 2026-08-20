import express from "express"
import { createClient } from "redis"

const app=express();
app.use(express.json());

const redisClient = createClient({ url: 'redis://redis:6379' });
redisClient.on('error', (err) => console.log('Redis Client Error', err));
await redisClient.connect();

let payments=[];

// Subscribe to ORDER_CREATED event
await redisClient.subscribe('ORDER_CREATED', (message) => {
    const order = JSON.parse(message);
    console.log("Received ORDER_CREATED event:", order);
    
    // Automatically process payment for the created order
    const payment={
        id:Date.now(),
        orderId: order.id,
        userId: order.userId,
        amount: order.amount,
        status: "PAID"
    }
    payments.push(payment);
    console.log("Payment processed for order:", order.id);
});

// Manual endpoint for payments if needed
app.post("/",async(req,res)=>{
    const payment={
        id:Date.now(),
        userId:req.user?.email || "unknown",
        amount:req.body.amount,
        status:"PAID"
    }
    payments.push(payment)
    res.json(payment)
})
app.listen(3005,()=>{
    console.log("Payment Service is running on port 3005")
})