import express from "express";
import fs from "fs";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import db from "./models/index.js";
const { User } = db;


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
        const { email, password, firstName, lastName, age, role, avatar, phone } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = { email, password: hashedPassword, firstName, lastName, age, role, avatar, phone, isActive: true };
        const data = await User.create(user);
        res.status(200).send({
            status: "success",
            message: "User registered successfully",
            data: data
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" })
    }
})

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).send({ message: "User not found" })
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).send({ message: "Invalid password" })
        }
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).send({ token })
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" })
    }
})

app.listen(3001, () => {
    console.log("Auth Service is running on port 3001");
})