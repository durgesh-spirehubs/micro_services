import express from "express"
const app=express();
app.use(express.json());
let payments=[];
app.post("/",async(req,res)=>{
    const payment={
        id:Date.now(),
        userId:req.user.email,
        amount:req.body.amount,
        status:"PAID"
    }
    payments.push(payment)
    res.json(payment)
})
app.listen(3005,()=>{
    console.log("Payment Service is running on port 3005")
})