const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Koneksi ke MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'azure_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// Rute halaman utama
app.get('/', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) throw err;
        res.render('index', { users: results });
    });
});

// Rute halaman tambah pengguna
app.get('/users/add', (req, res) => {
    res.render('add');
});

// Rute menambahkan pengguna
app.post('/users', (req, res) => {
    const { name, email } = req.body;
    db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Rute halaman edit pengguna
app.get('/users/edit/:id', (req, res) => {  // Perbaiki route
    const userId = req.params.id;
    const sql = 'SELECT * FROM users WHERE id = ?';

    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (result.length === 0) {
            return res.status(404).send('User not found');
        }
        res.render('edit', { user: result[0] });
    });
});

// Rute update pengguna
app.post('/users/update/:id', (req, res) => {  // Perbaiki agar ID ada di URL
    const userId = req.params.id;
    const { name, email } = req.body;
    db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, userId], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Rute hapus pengguna
app.post('/users/delete', (req, res) => {
    const { id } = req.body;
    db.query('DELETE FROM users WHERE id = ?', [id], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Jalankan server
app.listen(3000, () => {
    console.log('Server berjalan di http://localhost:3000');
});
