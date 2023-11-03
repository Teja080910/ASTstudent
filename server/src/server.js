import cors from "cors";
import express from 'express';
import { connectToDB, db } from './db.js';
const app=express()
let stop=false;
app.use(express.json())
app.use(cors())

app.get('/',async(req,res)=>
{
    res.send("Ok continue");
})
// **************************************Student Register****************************************//
app.post("/studentdata",async(req,res)=>
{
    await db.collection("Studentdata").find().toArray()
    .then((details)=>
    {
        res.json(details)
    })
    .catch((e)=>console.log(e))
})
app.post('/studentregister/:name/:mail/:number/:regi/:branch/:sec/:team',async(req,res)=>
{
    await db.collection("Studentdata").findOne({Teamname:req.params.team})
    .then(async(details)=>
    {
        if(details)
        {
            await db.collection("Studentdata").findOneAndUpdate({Teamname:req.params.team},{$push:{Teammembers:{Name:req.params.name,Gmail:req.params.mail,Phonenumber:req.params.number,Registernumber:req.params.regi,Branch:req.params.branch,Section:req.params.sec}}})
            .then((details)=>
            {
                res.json(details)
            })
        }
        else
        {
            await db.collection("Studentdata").insertOne({Teamname:req.params.team,Teammembers:[{Name:req.params.name,Gmail:req.params.mail,Phonenumber:req.params.number,Registernumber:req.params.regi,Branch:req.params.branch,Section:req.params.sec}]})
            .then((details)=>
            {
                res.json(details)
            })
        }
    })
})
app.post("/verifyregister/:regd",async(req,res)=>
{
    await db.collection("Studentdata").findOne({[`Teammembers.Registernumber`]:req.params.regd})
    .then((details)=>
    {
        res.json(details)
    })
    .catch((e)=>console.log(e))
})
app.post('/remove',async(req,res)=>
{
    await db.collection("Studentdata").findOneAndUpdate({Teamname:req.body.rmv.item.Teamname},{$pull:{Teammembers:{Registernumber:req.body.rmv.val.Registernumber}}})
    .then((details)=>
    {
        res.json(details)
    })
    .catch((e)=>console.log(e))
})



// ******************************************************Question and Answers****************************************//
app.post("/questions/:theme/:ques/:ans",async(req,res)=>
{
    await db.collection("Exam").findOne({Theme:req.params.theme})
    .then(async(details)=>
    {
        if(details)
        {
            await db.collection("Exam").findOne({[`List.Question`]:req.params.ques})
            .then(async(details)=>
            {
                const details1=null
                if (details) {
                    details.List.map((val) => {
                        if (val.Question === req.params.ques)
                        {
                            res.json(details1);
                        }
                    })
                }
                else
                {
                    await db.collection("Exam").findOneAndUpdate({ Theme: req.params.theme }, { $push: { List: { Question: req.params.ques, Answer: req.params.ans } } })
                        .then((details) => {
                            res.json(details);
                        })
                        .catch((e) => console.log(e))
                }
            })
                .catch((e) => console.log(e))
        }
        else
        {
            await db.collection("Exam").insertOne({Theme:req.params.theme,List:[{Question:req.params.ques,Answer:req.params.ans}]})
            .then((details)=>
            {
                res.json(details);
            })
            .catch((e)=>console.log(e))
        }
    })
    .catch((e)=>console.log(e))
})


// *****************************************************Choose the correct answers*****************************************//
app.post("/chooseanswer/:theme/:ques/:ans/:ans1/:ans2/:ans3/:ans4",async(req,res)=>
{
    await db.collection("Exam").findOne({Theme:req.params.theme})
    .then(async(details)=>
    {
        if(details)
        {
            await db.collection("Exam").findOne({[`List.Question`]:req.params.ques})
            .then(async(details)=>
            {
                const details1=null
                if (details) {
                    details.List.map((val) => {
                        if (val.Question === req.params.ques)
                        {
                            res.json(details1);
                        }
                    })
                }
                else
                {
                    await db.collection("Exam").findOneAndUpdate({ Theme: req.params.theme }, { $push: { List: { Question: req.params.ques,Answer1:req.params.ans1,Answer2:req.params.ans2,Answer3:req.params.ans3,Answer4:req.params.ans4,Answer: req.params.ans } } })
                        .then((details) => {
                            res.json(details);
                        })
                        .catch((e) => console.log(e))
                }
            })
                .catch((e) => console.log(e))
        }
        else
        {
            await db.collection("Exam").insertOne({Theme:req.params.theme,List:[{Question:req.params.ques,Answer1:req.params.ans1,Answer2:req.params.ans2,Answer3:req.params.ans3,Answer4:req.params.ans4,Answer:req.params.ans}]})
            .then((details)=>
            {
                res.json(details);
            })
            .catch((e)=>console.log(e))
        }
    })
    .catch((e)=>console.log(e))
})
app.post('/chooseanswer',async(req,res)=>
{
    await db.collection("Studentdata").findOne({[`Teammembers.${req.body.ans1.index}.Registernumber`]:req.body.ans1.val.Registernumber})
    .then((details)=>
    {
        // console.log(details)
        res.json(details)
    })
    .catch((e)=>console.log(e))
})


// *************************************************Fill in the blanks********************************************//
app.post("/fillbank/:theme/:ques/:ans",async(req,res)=>
{
    await db.collection("Exam").findOne({Theme:req.params.theme})
    .then(async(details)=>
    {
        if(details)
        {
            await db.collection("Exam").findOne({[`List.Question`]:req.params.ques})
            .then(async(details)=>
            {
                const details1=null
                if (details) {
                    details.List.map((val) => {
                        if (val.Question === req.params.ques)
                        {
                            res.json(details1);
                        }
                    })
                }
                else
                {
                    await db.collection("Exam").findOneAndUpdate({ Theme: req.params.theme }, { $push: { List: { Question: req.params.ques, Answer: req.params.ans } } })
                        .then((details) => {
                            res.json(details);
                        })
                        .catch((e) => console.log(e))
                }
            })
                .catch((e) => console.log(e))
        }
        else
        {
            await db.collection("Exam").insertOne({Theme:req.params.theme,List:[{Question:req.params.ques,Answer:req.params.ans}]})
            .then((details)=>
            {
                res.json(details);
            })
            .catch((e)=>console.log(e))
        }
    })
    .catch((e)=>console.log(e))
})


// *************************************************Exam Data*******************************************//
app.post('/examdata',async(req,res)=>
{
    await db.collection("Exam").find().toArray()
    .then((details)=>
    {
        res.json(details)
    })
    .catch((e)=>console.log(e))
})


// ***************************************************After Exam Data**************************************//
app.post('/exam/:regd/:index/:ques/:ans/:ans1',async(req,res)=>
{
    await db.collection("ExamSheet").findOne({Registernumber:req.params.regd})
    .then(async(details)=>
    {
        if(details)
        {
            await db.collection("ExamSheet").findOne({Registernumber:req.params.regd,[`Paper.${req.params.index}.Question`]:req.params.ques})
            .then(async(details)=>
            {
                if (details)
                {
                    await db.collection("ExamSheet").findOneAndUpdate({ Registernumber:req.params.regd }, {$set:{[`Paper.${req.params.index}.EnterAnswer`]:req.params.ans1}})
                        .then((details) =>
                        {
                            res.json(details);
                        })
                        .catch((e) => console.log(e))
                }
                else
                {
                    await db.collection("ExamSheet").findOneAndUpdate({ Registernumber:req.params.regd }, { $push: { Paper: { Question:req.params.ques,CorrectAnswer:req.params.ans,EnterAnswer:req.params.ans1 } } })
                        .then((details) => {
                            res.json(details);
                        })
                        .catch((e) => console.log(e))
                }
            })
                .catch((e) => console.log(e))
        }
        else
        {
            await db.collection("ExamSheet").insertOne({Registernumber:req.params.regd,Paper:[{Question:req.params.ques,CorrectAnswer:req.params.ans,EnterAnswer:req.params.ans1}]})
            .then((details)=>
            {
                res.json(details);
            })
            .catch((e)=>console.log(e))
        }
    })
    .catch((e)=>console.log(e))
})
app.post('/paperdata',async(req,res)=>
{
    await db.collection("ExamSheet").find().toArray()
    .then((details)=>
    {
        res.json(details)
    })
    .catch((e)=>console.log(e))
})
// app.get('/paperdata',async(req,res)=>
// {
//     await db.collection("ExamSheet").find().toArray()
//     .then((details)=>
//     {
//         res.json(details)
//     })
//     .catch((e)=>console.log(e))
// })



// ******************************************************Request***********************************************//
app.post('/request/:index/:regd',async(req,res)=>
{
    await db.collection("Studentdata").findOneAndUpdate({[`Teammembers.${req.params.index}.Registernumber`]:req.params.regd},{$set:{[`Teammembers.${req.params.index}.Request`]:true}})
    .then((details)=>
    {
        res.json(details)
    })
    .catch((e)=>console.log(e))
})
app.post('/acceptrequest/:index/:regd',async(req,res)=>
{
    await db.collection("Studentdata").findOneAndUpdate({[`Teammembers.${req.params.index}.Registernumber`]:req.params.regd},{$set:{[`Teammembers.${req.params.index}.Request`]:false,[`Teammembers.${req.params.index}.Confirm`]:true}})
    .then((details)=>
    {
        res.json(details)
    })
    .catch((e)=>console.log(e))
})


// *************************************Submit exam********************************************//
app.post('/sumitexam/:index/:regd/:marks',async(req,res)=>
{
    await db.collection("Studentdata").findOne({[`Teammembers.${req.params.index}.Registernumber`]:req.params.regd})
    .then((details)=>
    {
        details.Teammembers.map((val)=>
        {
            if(val.Registernumber===req.params.regd && val.Marks)
            {
                stop=true;
                const marks=parseInt(val.Marks)+parseInt(req.params.marks)
                db.collection("Studentdata").findOneAndUpdate({ [`Teammembers.${req.params.index}.Registernumber`]: req.params.regd }, { $set: { [`Teammembers.${req.params.index}.Confirm`]: false ,[`Teammembers.${req.params.index}.Marks`]:marks} })
                    .then((details) =>
                    {
                        return res.json(details)
                    })
                    .catch((e) => console.log(e))
            }
            else
            {
                if(!stop)
                {
                    db.collection("Studentdata").findOneAndUpdate({ [`Teammembers.${req.params.index}.Registernumber`]: req.params.regd }, { $set: { [`Teammembers.${req.params.index}.Confirm`]: false,[`Teammembers.${req.params.index}.Marks`]:req.params.marks } })
                    .then((details) => 
                    {
                        res.json(details)
                    })
                    .catch((e) => console.log(e))
                }
            }
        })
    })
    .catch((e)=>console.log(e))
})
app.post('/correctionanswer/:regd/:question/:mark',async(req,res)=>
{
    await db.collection("ExamSheet").findOne({Registernumber:req.params.regd})
    .then((details)=>
    {
        details.Paper.map((val,index)=>
        {
            if(val.Question===req.params.question)
            {
                db.collection("ExamSheet").findOneAndUpdate({Registernumber:req.params.regd  }, { $set: {[`Paper.${index}.Correction`]: true } })
                    .then((details) =>
                    {
                        if(details)
                        {
                            db.collection("Studentdata").findOne({ [`Teammembers.Registernumber`]: req.params.regd })
                            .then((details) => {
                                details.Teammembers.map((val, index) => {
                                    if (val.Registernumber === req.params.regd && val.Marks) {
                                        const marks = parseInt(val.Marks) + parseInt(req.params.mark)
                                        db.collection("Studentdata").findOneAndUpdate({ [`Teammembers.${index}.Registernumber`]: req.params.regd }, { $set: { [`Teammembers.${index}.Marks`]: marks } })
                                                .then((details) => {
                                                    return res.json(details)
                                                })
                                                .catch((e) => console.log(e))
                                    }
                                })
                            })
                            .catch((e) => console.log(e))
                        }
                    })
                    .catch((e) => console.log(e))
            }
        })
    })
    .catch((e)=>console.log(e))
})
app.post('/papercorrection/:regd/:marks',async(req,res)=>
{
    await db.collection("Studentdata").findOne({[`Teammembers.Registernumber`]:req.params.regd})
    .then((details)=>
    {
        details.Teammembers.map((val,index)=>
        {
            if(val.Registernumber===req.params.regd && val.Marks)
            {
                const marks = parseInt(val.Marks) + parseInt(req.params.marks)
                db.collection("Studentdata").findOneAndUpdate({ [`Teammembers.${index}.Registernumber`]: req.params.regd }, { $set: {[`Teammembers.${index}.Marks`]: marks } })&&
                db.collection("ExamSheet").findOneAndUpdate({ Registernumber:req.params.regd }, {$set:{Correction:true}})
                    .then((details) =>
                    {
                        return res.json(details)
                    })
                    .catch((e) => console.log(e))
            }
        })
    })
    .catch((e)=>console.log(e))
})




connectToDB(()=>{
    app.listen(9899,()=>{
        console.log('server Running at port 9899')
    })
}
)