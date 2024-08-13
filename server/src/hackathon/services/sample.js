import { db1 } from "../../db.js";
import xlsx from 'xlsx';
async function exportLowAttendanceStudents(days,res) {
  try {
    const collection = db1.collection('Hackathondata');

    const students = await collection.find({ AttendDays: parseInt(days || 2) } ).toArray();

    if (students.length === 0) {
      return res.send('No matching students.');
      
    }

    const studentsData = students.map(student => ({
      name: student.Name,
      RegdNumber: student.Reg_No,
      Mobile: student.Number,
      AttendDays: student.AttendDays,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(studentsData);

    xlsx.utils.book_append_sheet(wb, ws, `LowAttendanceStudents_withdays${days}`);

    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.send( buffer);
  } catch (error) {
    console.error('Error exporting students:', error);
    throw error;
  }
}
export default exportLowAttendanceStudents;