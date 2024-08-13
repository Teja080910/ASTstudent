import { db1 } from "../../db.js";
import xlsx from 'xlsx';

async function fetchUsers() {
  const users = [];
  
  // Fetch all teams and hackathon data
  const teams = await db1.collection("Teams").find().toArray();
  const hackathonData = await db1.collection("Hackathondata").find().toArray();
  
  const hackathonDataMap = hackathonData.reduce((acc, student) => {
    acc[student.Reg_No.toLowerCase().trim()] = student;
    return acc;
  }, {});

  for (const doc of teams) {
    if (doc.Team) {
      for (const user of doc.Members) {
        const student = hackathonDataMap[user.toLowerCase().trim()];
        if (student) {
          users.push({
            TeamName: doc.Team,
            Name: student.Name,
            Year: student.Year,
            Branch: student.Branch,
          });
        }
      }
    }
  }

  return users;
}

async function exportUsersToExcel(res) {
  try {
    const users = await fetchUsers();

    if (users.length === 0) {
      return res.send('No users found.');
    }

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(users);

    xlsx.utils.book_append_sheet(wb, ws, 'Users');

    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename=Users.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    console.error('Error exporting users to Excel:', error);
    res.status(500).send('Error exporting users.');
  }
}

export { fetchUsers, exportUsersToExcel };
