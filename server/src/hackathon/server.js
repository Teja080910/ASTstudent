import cors from "cors";
import crypto from 'crypto';
import express from 'express';
import nodemailer from 'nodemailer';
import { db } from '../db.js';
import { message } from "./message/message.js";
import { link } from "./message/link.js";

const app = express()
app.use(express.json())
app.use(cors())

app.get('/hackathon', async (req, res) => {
    res.send("Ok hacthon");
})



app.post('/signup/:email/:name/:regd/:num/:year/:branch/:section', async (req, res) => {
    const user = await db.collection('Hackathondata').findOne({ Reg_No: req.params.regd });
    if (user?.Reg_No) {
        res.json({ register: "already exist", data: user});
    }
    else {
        await db.collection('Hackathondata').insertOne({ Gmail: req.params.email, Name: req.params.name, Number: req.params.num, Reg_No: req.params.regd, Year: req.params.year, Branch: req.params.branch, Section: req.params.section })
            .then((details) => {
                res.json({ message: "sucess", data: details });
            })
            .catch((e) => console.log(e))
    }
})

// app.get('/hackathon/register',async(req,res)=>{
//     const data=await db.collection('Signup').find().toArray()
//     console.log(data)
// })

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
// const name="teja"
// console.log(name.slice(0,1))

// app.get('/sendPassword/:regd/:password', async (req, res) => {
//     await transporter.sendMail({
//         from: 'collegeworks0910@example.com',
//         to: ["sailakshmiborra4102@gmail.com", "tejasimma033@gmail.com"],
//         subject: "hiii",
//         html: await message.html("sai", "sai@2002", "21b91a1225"),
//     })
//         .then((details) => res.json({ message: "sucessfully sent mail", data: details }))
//         .catch((e) => res.json({ errmsg: "Required fileds", error: e }))
// });





app.post('/signin', async (req, res) => {
    const { regd, password } = req.body;
    try {
        const user = await db.collection('Hackathondata').findOne({ Reg_No: regd });
        if (!user.Reg_No) {
            return res.json({ error: 'Invalid registration number.' });
        }
        if (!user.Password) {
            const crepassword = user?.Name.slice(0, 1) + "@" + crypto.randomBytes(3).toString('hex');
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user?.Gmail,
                subject: "vedic vision hacthon web login",
                html: await message.html(user?.Name, crepassword, user?.Reg_No),
            }) && await db.collection('Hackathondata').findOneAndUpdate({ Reg_No: regd }, { $set: { Password: crepassword } })
                .then((details) => res.json({ message: "password sucessfully sent to your mail", data: details }))
                .catch((e) => res.json({ errmsg: "Required fileds", error: e }))
        }
        if (user?.Password === password) {
            res.status(200).json({ passmessage: "login sucessfully", data: user })
        }
        else {
            res.json({ passerror: "incorrect password", data: "data not found" })
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error during signin' });
    }
});




app.post('/updatepasswordlink', async (req, res) => {
    const { regd } = req.body;
    try {
        const user = await db.collection('Hackathondata').findOne({ Reg_No: regd });
        if (!user) {
        return res.json({ error: 'Invalid registration number.' });
        }

        const linkUrl = "http://localhost:3000/hackathon/newupdate";

        if (user.Gmail) {
        const emailContent = await link.html(user.Name, linkUrl, user.Reg_No);
        
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.Gmail,
            subject: "vedic vision hackathon web password update",
            html: emailContent,
        });

        return res.json({ message: "Update password link successfully sent to your email." });
    } else {
        return res.json({ error: 'No email address found for this user.' });
    }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error during signin.' });
    }
  });

// app.post('/updatepasswordlink', async (req, res) => {
//     const { regd } = req.body;
//     try {
//         const user = await db.collection('Hackathondata').findOne({ Reg_No: regd });
//         if (!user) {
//             return res.json({ error: 'Invalid registration number.' });
//         }
//         const link = "http://localhost:3000/hackathon/newupdate"
//         if (user.Gmail) {
//             await transporter.sendMail({
//                 from: process.env.EMAIL_USER,
//                 to: user?.Gmail,
//                 subject: "vedic vision hacthon web password update",
//                 html: await link.html(user?.Name, link, user?.Reg_No),
//             })
//                 .then((details) => res.json({ message: "update password link sucessfully sent to your mail", data: details }))
//                 .catch((e) => res.json({ errmsg: "Required fileds", error: e }))
//         }
//     } catch (e) {
//         console.error(e);
//         res.status(500).json({ message: 'Error during signin' });
//     }
// });






app.post('/sendotp', async (req, res) => {
    const { regd } = req.body;
    try {
        const user = await db.collection('Hackathondata').findOne({ Reg_No: regd });

        if (!user) {
            return res.status(400).json({ error: 'Invalid registration number.' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

        
        await db.collection('Hackathondata').updateOne(
            { Reg_No: regd },
            { $set: { otp: otp } }
        );

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.Gmail,
            subject: "Your OTP for Password Update",
            html: `<p>Hi ${user.Name},</p><p>Your OTP for updating your password is ${otp}. This OTP is valid for 10 minutes.</p>`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "OTP successfully sent to your email" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error sending OTP' });
    }
});






app.post('/updatepassword', async (req, res) => {
    const { regd, password } = req.body;
    try {
        const user = await db.collection('Hackathondata').findOne({ Reg_No: regd });

        if (!user) {
            return res.status(400).json({ error: 'Invalid registration number.' });
        }

        await db.collection('Hackathondata').updateOne(
            { Reg_No: regd },
            { $set: { password: password } } 
        );

        // Clear the OTP from the database
        await db.collection('Hackathondata').updateOne(
            { Reg_No: regd },
            { $unset: { otp: "" } }
        );

        res.status(200).json({ message: "Password successfully updated" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error updating password' });
    }
});







app.post('/newsignin', async (req, res) => {
    const { regd, password } = req.body;
    try {
        console.log("Received registration number:", regd);
        console.log("Received password:", password);
        const user = await db.collection('Hackathondata').findOne({ Reg_No: regd });

        if (!user) {
            return res.status(400).json({ error: 'Invalid registration number.' });
        }

        if (user.password !== password) {
            return res.status(400).json({ passerror: 'Incorrect password.' });
        }

        return res.status(200).json({ passmessage: 'Login successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ errmsg: 'Error during login' });
    }
});





export default app