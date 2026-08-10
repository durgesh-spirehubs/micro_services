import express from "express"
import jwt from "jsonwebtoken"
const app=express();

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
        id:Date.now(),
        userId:req.user.username,
        status:"CREATED"
    }
    orders.push(order)
    res.json(order)
})
app.listen(3004,()=>{
    console.log("Order Service is running on port 3004")
})