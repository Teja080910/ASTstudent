import { db1 } from "../../db.js";
import xlsx from 'xlsx';

async function exportTeamPsData(req, res) {
  try {
    const collection = db1.collection('Teams');

    const students = await collection.find({ Team: { $exists: true } ,PS:{$exists:true}}).toArray();

    const teamData = students.map(student => ({
      TeamCode: student.TeamCode,
      Teamname: student.Team,
      TlPhoneNumber: student.Phone,
      PsNumber: student.PS?.Number,
      PsTitle: student.PS?.Statement,
      PsDesc: student.PS?.Desc
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(teamData);

    xlsx.utils.book_append_sheet(wb, ws, 'Team_PS_Data');

    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="Team_PS_Data.xlsx"');
    res.send(buffer);
  } catch (error) {
    console.error('Error exporting students:', error);
    res.status(500).send('Error exporting data');
  }
}

export default exportTeamPsData;
