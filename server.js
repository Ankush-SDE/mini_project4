const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware setup
app.use(cors());
app.use(express.json());

// Dummy user database for demonstration
const users = [
    { email: 'student@gla.ac.in', password: 'password123' },
    { email: 'admin@gla.ac.in', password: 'admin' }
];

// Login API Endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    // Authenticate user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        console.log(`[SUCCESS] User logged in: ${email}`);
        res.status(200).json({ 
            message: 'Login successful', 
            user: { email: user.email } 
        });
    } else {
        console.log(`[FAILED] Failed login attempt for: ${email}`);
        res.status(401).json({ message: 'Invalid email or password' });
    }
});

// Register API Endpoint
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        console.log(`[CONFLICT] Registration failed, user exists: ${email}`);
        return res.status(409).json({ message: 'User already exists. Please login.' });
    }

    // Register user
    users.push({ name, email, password });
    console.log(`[SUCCESS] New user registered: ${email}`);
    res.status(201).json({ message: 'Registration successful' });
});

// Smart AI Chat Endpoint
app.post('/api/chat', (req, res) => {
    const { message } = req.body;
    
    if (!message) {
        return res.status(400).json({ reply: 'I need a message to process!' });
    }

    console.log(`[AI REQUEST] User says: "${message}"`);
    
    // Simulate smart AI Logic based on keywords
    let reply = "";
    const msg = message.toLowerCase();
    
    if (msg.includes('hello') || msg.includes('hi')) {
        reply = "Hello there! I am your Smart AI. How can I assist you with your B.Tech studies today?";
    } else if (msg.includes('roadmap') || msg.includes('plan')) {
        reply = "The roadmap is a great place to start! Year 1 focuses on C++ and basics. Year 2 dives into MERN stack. Make sure you follow it closely!";
    } else if (msg.includes('pyq') || msg.includes('exam') || msg.includes('paper')) {
        reply = "For exams, you absolutely have to check out the 'Previous Year Questions' section below the coding tracks. Practicing PYQs is the key to a high GPA!";
    } else if (msg.includes('login') || msg.includes('register')) {
        reply = "You can jump to the Login page via the navbar. If you don't have an account, there's a handy register link right there.";
    } else {
        reply = `That is an interesting thought! Since I am currently running in local demo mode, I can't write a full essay, but if hooked up to Gemini or OpenAI, I'd give you a highly detailed breakdown about: "${message}".`;
    }

    // Network latency simulation
    setTimeout(() => {
        res.status(200).json({ reply });
    }, 800);
});

// Start the backend server
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(` Backend server running on: http://localhost:${PORT}`);
    console.log(`=========================================`);
    console.log(` Try logging in with: student@gla.ac.in / password123`);
});
