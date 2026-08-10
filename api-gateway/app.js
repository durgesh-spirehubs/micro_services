import express from "express";
import httpProxy from "http-proxy";
import jwt from "jsonwebtoken"
const app = express();
const proxy = httpProxy.createProxyServer();
const SERVICES = {
    AUTH_SERVICE:"http://auth-service:3001",
    ORDER_SERVICE:"http://order-service:3004",
    PAYMENT_SERVICE:"http://payment-service:3005",
}

function authMiddleware(req,res,next){
    if(req.path.startsWith('/auth')){
        return next();
    }
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).send({message:"Unauthorized"})
    }
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
    try {
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decodedToken;
        req.headers['x-user-username'] = decodedToken.username;
        next();
    } catch (error) {
        return res.status(401).send({message:"Unauthorized"})
    }   
}
app.get("/health", async (req, res) => {
    try {
        res.status(200).send({
            status:"success",
            message:"API Gateway is running",
            
        })
    } catch (error) {
        console.log(error);
        
    }
})  

app.use(authMiddleware);
app.use("/auth",(req,res)=>{
    proxy.web(req,res,{target:SERVICES.AUTH_SERVICE})
})
app.use("/orders",(req,res)=>{
    proxy.web(req,res,{target:SERVICES.ORDER_SERVICE})
})
app.use("/payment",(req,res)=>{
    proxy.web(req,res,{target:SERVICES.PAYMENT_SERVICE})
})
proxy.on("error",(error,req,res)=>{
    console.error(error);
    res.status(500).send({message:"Internal Service Error"})
})

app.listen(3000,()=>{
    console.log("API Gateway is running on port 3000");
})