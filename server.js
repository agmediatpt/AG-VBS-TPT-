import express from 'express';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

/* global process */

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vbs2026')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define schemas
const registrationSchema = new mongoose.Schema({
  areaName: String,
  memberCount: String,
  inchargePerson: String,
  dateSubmitted: { type: Date, default: Date.now }
});

const teacherSchema = new mongoose.Schema({
  id: Number,
  name: String,
  attendance: {
    "27": { type: Boolean, default: false },
    "28": { type: Boolean, default: false },
    "29": { type: Boolean, default: false },
    "30": { type: Boolean, default: false }
  }
});

const studentSchema = new mongoose.Schema({
  id: String,
  studentName: String,
  teacherName: String,
  addedBy: String,
  attendance: {
    "27": { type: Boolean, default: false },
    "28": { type: Boolean, default: false },
    "29": { type: Boolean, default: false },
    "30": { type: Boolean, default: false }
  }
});

const expenseSchema = new mongoose.Schema({
  id: String,
  billName: String,
  purchasedBy: String,
  amount: String,
  date: { type: Date, default: Date.now }
});

const reportSchema = new mongoose.Schema({
  id: String,
  savedAt: { type: Date, default: Date.now },
  registrations: [Object],
  teacherAttendance: [Object],
  studentAttendance: [Object],
  expenses: [Object],
  summary: Object
});

const adminSchema = new mongoose.Schema({
  eventName: String,
  startDate: String,
  endDate: String,
  contactEmail: String,
  theme: String
});

// Create models
const Registration = mongoose.model('Registration', registrationSchema);
const Teacher = mongoose.model('Teacher', teacherSchema);
const Student = mongoose.model('Student', studentSchema);
const Expense = mongoose.model('Expense', expenseSchema);
const Report = mongoose.model('Report', reportSchema);
const Admin = mongoose.model('Admin', adminSchema);

// Initialize default data in MongoDB
async function initializeData() {
  try {
    // Initialize teachers if not exists
    const teacherCount = await Teacher.countDocuments();
    if (teacherCount === 0) {
      const defaultTeachers = [
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
        { id: 28, name: "Bro. Vasudevan", attendance: { "27": false, "28": false, "29": false, "30": false } },
        { id: 29, name: "Hari", attendance: { "27": false, "28": false, "29": false, "30": false } },
        { id: 30, name: "Jeba", attendance: { "27": false, "28": false, "29": false, "30": false } },
        { id: 31, name: "Yessaiya", attendance: { "27": false, "28": false, "29": false, "30": false } },
        { id: 32, name: "Vignesh", attendance: { "27": false, "28": false, "29": false, "30": false } },
        { id: 33, name: "Chandra Mohan", attendance: { "27": false, "28": false, "29": false, "30": false } }
      ];
      await Teacher.insertMany(defaultTeachers);
      console.log('Initialized default teachers');
    }
  } catch (err) {
    console.error('Error initializing data:', err);
  }
}

// Get all registrations
app.get('/api/registrations', async (req, res) => {
  try {
    const registrations = await Registration.find();
    res.json(registrations);
  } catch (err) {
    console.error('Error fetching registrations:', err);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

// Add new registration
app.post('/api/registrations', async (req, res) => {
  try {
    const newEntry = new Registration(req.body);
    const savedEntry = await newEntry.save();
    res.status(201).json({ message: 'Success', entry: savedEntry });
  } catch (err) {
    console.error('Error saving registration:', err);
    res.status(500).json({ error: 'Failed to save registration' });
  }
});

// Delete registration
app.delete('/api/registrations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.Types.ObjectId.isValid(id)) {
      await Registration.findByIdAndDelete(id);
    }
    res.status(200).json({ message: 'Registration deleted successfully' });
  } catch (err) {
    console.error('Error deleting registration:', err);
    res.status(500).json({ error: 'Failed to delete registration' });
  }
});

// Get all attendance data
app.get('/api/attendance', async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (err) {
    console.error('Error fetching attendance:', err);
    res.status(500).json({ error: 'Failed to fetch attendance data' });
  }
});

// Update attendance data for Teachers
app.post('/api/attendance', async (req, res) => {
  try {
    const updatedTeachers = req.body;
    
    for (const updated of updatedTeachers) {
      await Teacher.findOneAndUpdate(
        { id: updated.id },
        { 
          name: updated.name,
          attendance: updated.attendance 
        },
        { upsert: true, new: true }
      );
    }
    
    res.status(200).json({ message: 'Success' });
  } catch (err) {
    console.error('Error saving attendance:', err);
    res.status(500).json({ error: 'Failed to save attendance data' });
  }
});

// Get all student attendance data
app.get('/api/student-attendance', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    console.error('Error fetching student attendance:', err);
    res.status(500).json({ error: 'Failed to read student attendance data' });
  }
});

// Update student attendance data
app.post('/api/student-attendance', async (req, res) => {
  try {
    const updatedStudents = req.body;
    
    for (const updated of updatedStudents) {
      await Student.findOneAndUpdate(
        { id: updated.id },
        updated,
        { upsert: true, new: true }
      );
    }
    
    const totalStudents = await Student.countDocuments();
    res.status(200).json({ message: 'Success', totalStudents });
  } catch (err) {
    console.error('Error saving student attendance:', err);
    res.status(500).json({ error: 'Failed to save student attendance data' });
  }
});

// Delete a student
app.delete('/api/student-attendance/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Student.deleteOne({ id });
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// Get all expenses data
app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ error: 'Failed to read expenses data' });
  }
});

// Add new expense
app.post('/api/expenses', async (req, res) => {
  try {
    const newExpense = req.body;
    const expenseWithId = { id: Date.now().toString(), ...newExpense };
    const expense = new Expense(expenseWithId);
    const savedExpense = await expense.save();
    res.status(201).json({ message: 'Expense added successfully', expense: savedExpense });
  } catch (err) {
    console.error('Error saving expense:', err);
    res.status(500).json({ error: 'Failed to save expense data' });
  }
});

// Delete expense
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Check if ID is a valid MongoDB ObjectId or our custom timestamp ID
    if (mongoose.Types.ObjectId.isValid(id)) {
      await Expense.findByIdAndDelete(id);
    } else {
      await Expense.findOneAndDelete({ id: id });
    }
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (err) {
    console.error('Error deleting expense:', err);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// Get admin settings
app.get('/api/admin', async (req, res) => {
  try {
    const admin = await Admin.findOne() || {};
    res.json(admin);
  } catch (err) {
    console.error('Error fetching admin settings:', err);
    res.status(500).json({ error: 'Failed to read admin data' });
  }
});

// Update admin settings
app.post('/api/admin', async (req, res) => {
  try {
    const adminSettings = req.body;
    await Admin.findOneAndUpdate({}, adminSettings, { upsert: true, new: true });
    res.status(200).json({ message: 'Admin settings updated successfully' });
  } catch (err) {
    console.error('Error saving admin settings:', err);
    res.status(500).json({ error: 'Failed to save admin data' });
  }
});

// Get all saved reports
app.get('/api/reports', async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (err) {
    console.error('Error fetching reports:', err);
    res.status(500).json({ error: 'Failed to read reports data' });
  }
});

// Save a new report
app.post('/api/reports', async (req, res) => {
  try {
    const reportData = req.body;
    const reportWithId = { 
      id: Date.now().toString(),
      ...reportData 
    };
    const report = new Report(reportWithId);
    const savedReport = await report.save();
    res.status(201).json({ message: 'Report saved successfully', report: savedReport });
  } catch (err) {
    console.error('Error saving report:', err);
    res.status(500).json({ error: 'Failed to save report data' });
  }
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React routing, return all requests to React app
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server after MongoDB connection (for local development)
mongoose.connection.once('open', async () => {
  await initializeData();
  if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
      console.log(`Backend server running at port ${PORT}`);
    });
  }
});

// Export the Express app for Vercel serverless functions
export default app;
