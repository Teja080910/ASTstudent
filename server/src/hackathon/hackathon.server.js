import cors from "cors";
import express from 'express';
import session from 'express-session';
import { Resend } from 'resend';
import { HtrTeamMiddlware } from "../middleware/htm.middleware.js";
import { AllTeamRegistrers } from "./Teams/allteamregistrers.js";
import { checkHtr } from "./Teams/checkhtr.js";
import { AllTeamCodes, checkTeam, TeamPhotos } from "./Teams/checkteam.js";
import { CreateTeam } from "./Teams/createteams.js";
import { checkTechTeam } from "./Teams/techteam.js";
import { AllTechTeamMembers, UpdateTechTeamMemberStatus } from "./Teams/techteamactions.js";
import { SelectTask, UnSelectTask } from "./bootcamp/tasks/selecttask.js";
import { StudentTasks, Tasks } from "./bootcamp/tasks/tasks.js";
import { AddFeedback } from "./feedback/addfeedback.js";
import { CheckHackathon } from "./hacthonday/checkhackathon.js";
import { JoinHackathon } from "./joinhackathon/joinhackathon.js";
import { FileByName, Materials } from "./materials/material.js";
import { LikeMati, ViewMati } from "./materials/updatematerials.js";
import { PSS } from "./problemstatements/pss.js";
import { PSSC, SelectProStmt, UnSelectProStmt } from "./problemstatements/selectproblemstmt.js";
import { SendOtp } from "./updateuser/senotp.js";
import { UpdatePasswordLink } from "./updateuser/updatelink.js";
import { UpdatePassword } from "./updateuser/updatepassword.js";
import { checkUser } from "./user/checkuser.js";
import { SignIn } from "./user/sigin.js";
import { SignUp } from "./user/signup.js";
import { UpdateGender } from "./user/updategender.js";
import exportLowAttendanceStudents from "./services/sample.js"
import { exportUsersToExcel } from "./services/cerificates_data.js";
import exportTeamPsData from "./services/export_team_ps_data.js";

const resend = new Resend(process.env.Resend_Key);
const app = express()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }));

app.get('/hackathon', async (req, res) => {
    res.send("Ok hacthon");
})

app.use(session({
    secret: 'ast-team',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.post('/check-hackathon', async (req, res) => {
    await CheckHackathon("hackathon@gmail.com", res);
})

app.post('/updategender/:regd/:gender', async (req, res) => {
    await UpdateGender(req.params.regd, req.params.gender, res);
})

app.post('/statements', async (req, res) => {
    await PSS(req, res);
})

app.post('/signup/:email/:name/:regd/:num/:year/:branch/:section', async (req, res) => {
    await SignUp(req, res)
})

app.post('/login', async (req, res) => {
    await SignIn(req, resend, res)
});

app.post('/authuser/:regd', async (req, res) => {
    await checkUser(req.params.regd, res)
})

app.post('/updatepasswordlink', async (req, res) => {
    await UpdatePasswordLink(req, resend, res)
});

app.post('/sendotp', async (req, res) => {
    await SendOtp(req, resend, res);
});

app.post('/updatepassword', async (req, res) => {
    await UpdatePassword(req, res)
});

app.post('/selecttask', async (req, res) => {
    await SelectTask(req.body.user, req.body.task, req.body.marks, req.body.desc, req.body.day, res);
})

app.post('/unselecttask', async (req, res) => {
    await UnSelectTask(req.body.user, req.body.task, req.body.day, res);
})

app.post('/bootcamptasks', async (req, res) => {
    await Tasks(res)
});

app.post('/Students', async (req, res) => {
    await StudentTasks(res)
});

app.post('/files', async (req, res) => {
    await Materials(res)
});

app.get('/file/:filename', async (req, res) => {
    const { filename } = req.params;
    await FileByName(filename, res)
});

app.post('/likes', async (req, res) => {
    await LikeMati(req.body.theme, req.body.user, req.body.index, res)
});

app.post('/views', async (req, res) => {
    await ViewMati(req.body.theme, req.body.index, res)
});

// ***************************************** Hacthon *********************************************** //
app.post('/createteam/:team/:gmail/:phone/:code/:members/:password',HtrTeamMiddlware, async (req, res) => {
    await CreateTeam(req, res, resend);
})

app.post('/checkteam', async (req, res) => {
    const { code, password } = req.body;
    await checkTeam(code, password, res);
});

app.post('/checkhtr', async (req, res) => {
    const { code, password } = req.body;
    await checkHtr(code, password, res);
});
app.post('/checktechteammemberlogin', async (req, res) => {
    const { code, password } = req.body;
    await checkTechTeam(code, password, res);
});
app.put('/updatetechteammemberstatus/:id', async (req, res) => {
    await UpdateTechTeamMemberStatus(req, res);
});

app.post('/teamscodes', async (req, res) => {
    await AllTeamCodes(req, res)
})

app.post('/teamphotos', async (req, res) => {
    await TeamPhotos(req.body.teamcode, res)
})

app.post('/teamscodes', async (req, res) => {
    await AllTeamCodes(req, res)
})

app.post('/techteammembers', async (req, res) => {
    await AllTechTeamMembers(res);
});
app.post('/teamregistrers', async (req, res) => {
    await AllTeamRegistrers(req, res)
})

app.post("/joinhackathon", async (req, res) => {
    await JoinHackathon(req, res)
})

app.post('/selectps', async (req, res) => {
    await SelectProStmt(req.body.code, req.body.number, req.body.stmt, req.body.desc, res)
})

app.post('/pssc', async (req, res) => {
    await PSSC(res)
})

app.post('/unselectps', async (req, res) => {
    await UnSelectProStmt(req.body.code, req.body.number, res)
})

app.post("/addfeedback", async (req, res) => {
    await AddFeedback(req, res)
})

// app.get('/lowattendance', async (req, res) => {
//       await exportLowAttendanceStudents(req.query.days,res);
   
   
//   });

// app.get('/alldata', async (req, res) => {

// exportUsersToExcel(res)

// });
// app.get('/teamdata', async (req, res) => {

// exportTeamPsData(req,res)

// });

export default app