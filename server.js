

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3005;
const mongoURI = 'mongodb://localhost:27017/schoolFeesDB'; // Replace with your MongoDB URI

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the 'public' folder

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Student Schema
const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    class: { type: String, required: true },
    totalFees: { type: Number, default: 0 },
    feeStatus: { type: String, default: 'Pending' },
    payments: [{ amount: Number, date: Date }],
});

const Student = mongoose.model('Student', StudentSchema);

// Register student
app.post('/register', async (req, res) => {
    const { name, class: studentClass } = req.body;
    const newStudent = new Student({ name, class: studentClass });
    try {
        await newStudent.save();
        console.log(`Registered Student: ${newStudent.name}, Class: ${newStudent.class}`);
        res.json({ message: 'Student registered successfully!' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error registering student' });
    }
});

// Add payment
app.post('/pay', async (req, res) => {
    const { name, amount } = req.body;
    try {
        const student = await Student.findOne({ name: new RegExp(`^${name}$`, 'i') });
        if (student) {
            student.payments.push({ amount, date: new Date() });
            student.totalFees += amount; // Update total fees
            student.feeStatus = 'Paid'; // Update fee status
            await student.save();
            res.json({ message: 'Payment recorded successfully!', student });
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing payment' });
    }
});

// Get student statement of account
app.get('/student/:name/statement', async (req, res) => {
    const { name } = req.params;
    try {
        const student = await Student.findOne({ name: new RegExp(`^${name}$`, 'i') });
        if (student) {
            const totalPaid = student.payments.reduce((total, payment) => total + payment.amount, 0);
            const outstandingBalance = student.totalFees - totalPaid;
            res.json({
                student: student.name,
                class: student.class,
                totalFees: student.totalFees,
                totalPaid,
                outstandingBalance,
                payments: student.payments,
            });
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        console.error('Error fetching student statement:', error);
        res.status(500).json({ message: 'Error fetching student statement' });
    }
});

// View students
app.get('/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Error fetching students' });
    }
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});










