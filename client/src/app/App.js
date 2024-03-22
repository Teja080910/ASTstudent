import CryptoJS from "crypto-js";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Adminexam } from '../admin/examquestions/adminexam';
import { PaperCorrection } from '../admin/papercorrection/papercorrection';
import { AdminLogin } from '../admin/register/adminlogin.js';
import { Register } from '../admin/register/register';
import { Studentdata } from '../admin/studentdata/studentdata';
import { Studentscore } from '../admin/studentdata/studentscore';
import { Team } from '../admin/team/team';
import { id, lock, salt } from '../api.js';
import { Nav } from '../navbar/nav';
import { Exam } from '../student/exam/exam';
import { Login } from '../student/login/login.js';
import './App.css';
function App() {
  return (
    <>
    <Nav/>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={lock===CryptoJS.AES.decrypt(sessionStorage.lock, id).toString(salt)?<Team/>:<AdminLogin/>}/>
      <Route path='/192.5264.47' element={<Login/>}/>
      <Route path='/studentregister' element={<Register/>}/>
      <Route path='/adminexam' element={lock===CryptoJS.AES.decrypt(sessionStorage.lock, id).toString(salt)?<Adminexam/>:<AdminLogin/>}/>
      <Route path='/studentdata' element={lock===CryptoJS.AES.decrypt(sessionStorage.lock, id).toString(salt)?<Studentdata/>:<AdminLogin/>}/>
      <Route path='/studentscore' element={<Studentscore/>}/>
      <Route path='/papercorrection' element={lock===CryptoJS.AES.decrypt(sessionStorage.lock, id).toString(salt)?<PaperCorrection/>:<AdminLogin/>}/>
      <Route path='/192.5264.27' element={sessionStorage.student?<Exam/>:<Login/>}/>
    </Routes>
    </BrowserRouter>
    </>
  );
}
export default App;
