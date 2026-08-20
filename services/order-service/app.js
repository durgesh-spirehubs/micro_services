import express from "express"
import jwt from "jsonwebtoken"
import { createClient } from "redis"

const app=express();

const redisClient = createClient({ url: 'redis://redis:6379' });
redisClient.on('error', (err) => console.log('Redis Client Error', err));
await redisClient.connect();

function authMiddleware(req,res,next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).send({message:"Unauthorized: Missing Token"})
    }
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).send({message:"Unauthorized: Invalid Token"})
    }   
}

app.use(authMiddleware);
let orders=[];
app.get("/me", async(req, res) => {
    res.json({ user: req.user });
})

app.post("/",async(req,res)=>{
    const order={
        id:Date.now(), // changed from req.user.id to make it unique per order
        userId:req.user.email,
        amount: req.body?.amount || 100, // mock amount
        status:"CREATED"
    }
    orders.push(order)
    
    // Publish event
    await redisClient.publish('ORDER_CREATED', JSON.stringify(order));
    
    res.json(order)
})
app.listen(3004,()=>{
    console.log("Order Service is running on port 3004")
})