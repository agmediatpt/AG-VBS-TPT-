import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/* global process */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'database.json');
const CSV_FILE = path.join(__dirname, 'registrations.csv');
const ATTENDANCE_FILE = path.join(__dirname, 'attendance.json');
const STUDENT_ATTENDANCE_FILE = path.join(__dirname, 'student-attendance.json');
const EXPENSES_FILE = path.join(__dirname, 'expenses.json');
const ADMIN_FILE = path.join(__dirname, 'admin.json');
const REPORTS_FILE = path.join(__dirname, 'reports.json');

app.use(cors());
app.use(express.json());

// Initialize dummy DB files if they don't exist
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([]));
  updateCSVFile([]);
}

if (!fs.existsSync(ATTENDANCE_FILE)) {
  const initialTeachers = [
    { id: 1, name: "Sis. Gethsiyal", attendance: { "27": false, "28": false, "29": false, "30": false } },
    { id: 2, name: "Sharmila", attendance: { "27": false, "28": false, "29": false, "30": false } },
    { id: 3, name: "Sis. Gracepriya", attendance: { "27": false, "28": false, "29": false, "30": false } },
    { id: 4, name: "Sis. Archana", attendance: { "27": false, "28": false, "29": false, "30": false } },
    { id: 5, name: "Sis. Esther", attendance: { "27": false, "28": false, "29": false, "30": false } },
    { id: 6, name: "Jecitha", attendance: { "27": false, "28": false, "29": false, "30": false } },
    { id: 7, name: "Sofia", attendance: { "27": false, "28": false, "29": false, "30": false } },
    { id: 8, name: "Keerthana", attendance: { "27": false, "28": false, "29": false, "30": false } },
    { id: 9, name: "Sis. Jamuna", attendance: { "27": false, "28": false, "29": false, "30": false } },
    { id: 10, name: "Sis. Lakshmi", attendance: { "27": false, "28": false, "29": false, "30": false } },
    { id: 11, name: "Priya Angel", attendance: { "27": false, "28": false, "29": false, "30": false } },
    { id: 12, name: "Preethi", attendance: { "27": false, "28": false, "29": false, "30": false } },
    { id: 13, name: "Sis. Megala", attendance: { "27": false, "28": false, "29": false, "30": false } },
    { id: 14, name: "Sis. Puspalatha", attendance: { "27": false, "28": false, "29": false, "30": false } },
    { id: 15, name: "Sis. Priyadarshini", attendance: { "27": false, "28": false, "29": false, "30": false } },
    { id: 16, name: "Pr. Yuvashri", attendance: { "27": false, "28": false, "29": false, "30": false } },
    { id: 17, name: "Jessica", attendance: { "27": false, "28": false, "29": false, "30": false } },
    { id: 18, name: "Kishori", attendance: { "27": false, "28": false, "29": false, "30": false } },
    { id: 19, name: "Shekina", attendance: { "27": false, "28": false, "29": false, "30": false } },
    { id: 20, name: "Sis. Shamili", attendance: { "27": false, "28": false, "29": false, "30": false } },
    { id: 21, name: "Sis. Nithya", attendance: { "27": false, "28": false, "29": false, "30": false } },
    { id: 22, name: "Sis. Amutha Jose", attendance: { "27": false, "28": false, "29": false, "30": false } },
    { id: 23, name: "Bro. Lambert", attendance: { "27": false, "28": false, "29": false, "30": false } },
    { id: 24, name: "Sis. Dharani", attendance: { "27": false, "28": false, "29": false, "30": false } },
    { id: 25, name: "Sis. Remi", attendance: { "27": false, "28": false, "29": false, "30": false } },
    { id: 26, name: "Sis. Vennila", attendance: { "27": false, "28": false, "29": false, "30": false } },
    { id: 27, name: "Sis. Rajmary", attendance: { "27": false, "28": false, "29": false, "30": false } },
    { id: 28, name: "Bro. Vasudevan", attendance: { "27": false, "28": false, "29": false, "30": false } }
  ];
  fs.writeFileSync(ATTENDANCE_FILE, JSON.stringify(initialTeachers, null, 2));
}

if (!fs.existsSync(STUDENT_ATTENDANCE_FILE)) {
  fs.writeFileSync(STUDENT_ATTENDANCE_FILE, JSON.stringify([], null, 2));
}

if (!fs.existsSync(EXPENSES_FILE)) {
  fs.writeFileSync(EXPENSES_FILE, JSON.stringify([], null, 2));
}

if (!fs.existsSync(ADMIN_FILE)) {
  fs.writeFileSync(ADMIN_FILE, JSON.stringify({}, null, 2));
}

if (!fs.existsSync(REPORTS_FILE)) {
  fs.writeFileSync(REPORTS_FILE, JSON.stringify([], null, 2));
}

function updateCSVFile(registrations) {
  const headers = ["ID", "Area Name", "Member Count", "Incharge Person", "Date Submitted"];
  const rows = registrations.map(reg => [
    reg.id,
    `"${reg.areaName || ''}"`,
    reg.memberCount || '',
    `"${reg.inchargePerson || ''}"`,
    reg.dateSubmitted || ''
  ]);
  const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  fs.writeFileSync(CSV_FILE, csvContent);
}

// Get all registrations
app.get('/api/registrations', (req, res) => {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    const registrations = JSON.parse(data);
    res.json(registrations);
  } catch {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// Add new registration
app.post('/api/registrations', (req, res) => {
  try {
    const newEntry = req.body;
    const data = fs.readFileSync(DB_FILE, 'utf8');
    const registrations = JSON.parse(data);

    registrations.push(newEntry);
    fs.writeFileSync(DB_FILE, JSON.stringify(registrations, null, 2));
    updateCSVFile(registrations); // Save to CSV as well

    res.status(201).json({ message: 'Success', entry: newEntry });
  } catch {
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Get all attendance data
app.get('/api/attendance', (req, res) => {
  try {
    const data = fs.readFileSync(ATTENDANCE_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch {
    res.status(500).json({ error: 'Failed to read attendance data' });
  }
});

// Update attendance data for Teachers
app.post('/api/attendance', (req, res) => {
  try {
    const updatedTeachers = req.body;
    let allTeachers = [];
    if (fs.existsSync(ATTENDANCE_FILE)) {
      allTeachers = JSON.parse(fs.readFileSync(ATTENDANCE_FILE, 'utf8'));
    }

    // Merge logic
    updatedTeachers.forEach(updated => {
      const index = allTeachers.findIndex(t => t.id === updated.id);
      if (index >= 0) {
        allTeachers[index] = {
          ...allTeachers[index],
          ...updated,
          attendance: updated.attendance || allTeachers[index].attendance
        };
      }
    });

    fs.writeFileSync(ATTENDANCE_FILE, JSON.stringify(allTeachers, null, 2));
    res.status(200).json({ message: 'Success' });
  } catch {
    res.status(500).json({ error: 'Failed to save attendance data' });
  }
});

// Get all student attendance data
app.get('/api/student-attendance', (req, res) => {
  try {
    const data = fs.readFileSync(STUDENT_ATTENDANCE_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch {
    res.status(500).json({ error: 'Failed to read student attendance data' });
  }
});

// Update student attendance data
app.post('/api/student-attendance', (req, res) => {
  try {
    const updatedStudents = req.body;
    let allStudents = [];
    if (fs.existsSync(STUDENT_ATTENDANCE_FILE)) {
      allStudents = JSON.parse(fs.readFileSync(STUDENT_ATTENDANCE_FILE, 'utf8'));
    }

    // Merge logic
    updatedStudents.forEach(updated => {
      const index = allStudents.findIndex(s => s.id === updated.id);
      if (index >= 0) Object.assign(allStudents[index], updated);
      else allStudents.push(updated);
    });

    fs.writeFileSync(STUDENT_ATTENDANCE_FILE, JSON.stringify(allStudents, null, 2));
    res.status(200).json({ message: 'Success', totalStudents: allStudents.length });
  } catch {
    res.status(500).json({ error: 'Failed to save student attendance data' });
  }
});

// Get all expenses data
app.get('/api/expenses', (req, res) => {
  try {
    const data = fs.readFileSync(EXPENSES_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch {
    res.status(500).json({ error: 'Failed to read expenses data' });
  }
});

// Add new expense
app.post('/api/expenses', (req, res) => {
  try {
    const newExpense = req.body;
    let expenses = [];
    if (fs.existsSync(EXPENSES_FILE)) {
      expenses = JSON.parse(fs.readFileSync(EXPENSES_FILE, 'utf8'));
    }

    const expenseWithId = { id: Date.now().toString(), ...newExpense };
    expenses.push(expenseWithId);
    fs.writeFileSync(EXPENSES_FILE, JSON.stringify(expenses, null, 2));
    res.status(201).json({ message: 'Expense added successfully', expense: expenseWithId });
  } catch {
    res.status(500).json({ error: 'Failed to save expense data' });
  }
});

// Get admin settings
app.get('/api/admin', (req, res) => {
  try {
    const data = fs.readFileSync(ADMIN_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch {
    res.status(500).json({ error: 'Failed to read admin data' });
  }
});

// Update admin settings
app.post('/api/admin', (req, res) => {
  try {
    const adminSettings = req.body;
    fs.writeFileSync(ADMIN_FILE, JSON.stringify(adminSettings, null, 2));
    res.status(200).json({ message: 'Admin settings updated successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to save admin data' });
  }
});

// Get all saved reports
app.get('/api/reports', (req, res) => {
  try {
    const data = fs.readFileSync(REPORTS_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch {
    res.status(500).json({ error: 'Failed to read reports data' });
  }
});

// Save a new report
app.post('/api/reports', (req, res) => {
  try {
    const reportData = req.body;
    let reports = [];
    if (fs.existsSync(REPORTS_FILE)) {
      reports = JSON.parse(fs.readFileSync(REPORTS_FILE, 'utf8'));
    }

    const reportWithId = { 
      id: Date.now().toString(),
      savedAt: new Date().toISOString(),
      ...reportData 
    };
    reports.push(reportWithId);
    fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2));
    res.status(201).json({ message: 'Report saved successfully', report: reportWithId });
  } catch {
    res.status(500).json({ error: 'Failed to save report data' });
  }
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React routing, return all requests to React app
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Backend server running at port ${PORT}`);
});
