import bcrypt from 'bcrypt';
import cors from "cors";
import express from 'express';
import nodemailer from 'nodemailer';
import { connectToDB, db } from './db.js';
import { message } from './message.js';
import { Validyear } from './checkyear.js';

const app = express()
app.use(express.json())
app.use(cors())

app.get('/', async (req, res) => {
    res.send("Ok continue");
})



app.post('/signup/:email/:name/:num/:regd/:year/:branch/:section', async (req, res) => {
    const year = await Validyear(req.params.regd.slice(0,2));
    await db.collection('Signup').insertOne({ Gmail: req.params.email, Name: req.params.name, Number: req.params.num, Reg_No: req.params.regd, Year:year, Branch: req.params.branch, section: req.params.sec })
        .then((details) => {
            res.json(details);
            console.log(result)
        })
        .catch((e) => console.log(e))
})


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

app.get('/sendPassword/:regd/:password', async (req, res) => {
    await transporter.sendMail({
        from: 'collegeworks0910@example.com',
        to: ["sailakshmiborra4102@gmail.com", "tejasimma033@gmail.com"],
        subject: "hiii",
        html: await message.html("sai", "sai@2002", "21b91a1225"),
    })
        .then((details) => res.json({ message: "sucessfully sent mail", data: details }))
        .catch((e) => res.json({ errmsg: "Required fileds", error: e }))
});

app.post('/signin', async (req, res) => {
    const { regd, password } = req.body;

    if (!user) {
        return res.status(400).json({ message: 'Invalid registration number or password.' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
        res.status(200).json({ message: 'Login successful' });
    } else {
        res.status(400).json({ message: 'Invalid registration number or password.' });
    }
});

connectToDB(() => {
    app.listen(9889, () => {
        console.log('server Running at port 9889')
    })
}
)