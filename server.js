import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;
const DB_FILE = path.join(__dirname, 'database.json');
const CSV_FILE = path.join(__dirname, 'registrations.csv');

app.use(cors());
app.use(express.json());

// Initialize dummy DB file if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([]));
  updateCSVFile([]);
}

function updateCSVFile(registrations) {
  const headers = ["ID", "Children's Name", "Age", "Phone Number", "From Place", "Class Wish", "Registration Type", "Date Submitted"];
  const rows = registrations.map(reg => [
    reg.id,
    `"${reg.childrensName || ''}"`,
    reg.age || '',
    `"${reg.phoneNumber || ''}"`,
    `"${reg.fromPlace || ''}"`,
    `"${reg.classWish || ''}"`,
    `"${reg.registrationType || ''}"`,
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
  } catch (error) {
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Use process.env.PORT for cloud providers
const SERVER_PORT = process.env.PORT || PORT;
app.listen(SERVER_PORT, () => {
  console.log(`Backend server running at port ${SERVER_PORT}`);
});
