import express from "express";
import fs from "fs";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
// import pkg from '@prisma/client';
// const {PrismaClient} = pkg;
// const prisma = new PrismaClient();
const app = express();

const PORT = 3001;
app.use(express.json());

let USERS = [];
if (fs.existsSync("users.json")) {
    try {
        USERS = JSON.parse(fs.readFileSync("users.json"));
    } catch (e) {
        console.error("Could not parse users.json");
    }
}
app.post("/register", async (req, res) => {
    try {
        const {username,password} = req.body;
        const hashedPassword = await bcrypt.hash(password,10);
        const user = {username,password:hashedPassword};
        USERS.push(user);
        fs.writeFileSync("users.json", JSON.stringify(USERS, null, 2));
        res.status(201).send({message:"User registered successfully"})
    } catch (error) {
        console.error(error);
        res.status(500).send({message:"Internal Server Error"})
    }
})

app.post("/login", async (req, res) => {
    try {
        const {username,password} = req.body;
        const user = USERS.find((user) => user.username === username);
        if(!user){
            return res.status(401).send({message:"User not found"})
        }
        const validPassword = await bcrypt.compare(password,user.password);
        if(!validPassword){
            return res.status(401).send({message:"Invalid password"})
        }
        const token = jwt.sign({username},process.env.JWT_SECRET,{expiresIn:"1h"});
        res.status(200).send({token})
    } catch (error) {
        console.error(error);
        res.status(500).send({message:"Internal Server Error"})
    }
})

app.listen(3001,()=>{
    console.log("Auth Service is running on port 3001");
})