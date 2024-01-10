const express = require('express');
const { Pool } = require('pg');
const app = express();
const cors = require('cors');
const port = 3000;
app.use(express.json());
app.use(cors());
// Database connection settings
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});


// Connect to the database
pool.connect(err => {
    if (err) {
        console.error('Database connection error', err.stack);
    } else {
        console.log('Connected to database');
    }
});

app.get('/', async (req, res) => {
    try {
        const employees = await pool.query('SELECT * FROM employees');
        res.json(employees.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Define a route to get employees
app.get('/employees', async (req, res) => {
    try {
        const employees = await pool.query('SELECT * FROM employees');
        res.json(employees.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

//Delete an Employee 

app.delete('/employees/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const result = await pool.query('DELETE FROM employees WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).send('Employee not found');
        }
        res.send('Employee deleted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

//Update Salary

app.put('/employees/:id', async (req, res) => {
    const id = req.params.id;
    const { salary } = req.body; // Assuming you're sending the new salary in the request body

    try {
        const result = await pool.query('UPDATE employees SET salary = $1 WHERE id = $2', [salary, id]);
        if (result.rowCount === 0) {
            return res.status(404).send('Employee not found');
        }
        res.send('Employee updated successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
//Run Query
app.post('/run-query', async (req, res) => {
    const query = req.body.query;

    // Basic security check: only allow select queries
    // if (!query.toLowerCase().startsWith('select')) {
    //     return res.status(403).send('Only SELECT queries are allowed');
    // }

    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Query execution error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

