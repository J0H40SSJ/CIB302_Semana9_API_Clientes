const express = require('express');
const mysql = require('mysql2');
const app = express();
const PORT = 3000;
const db = mysql.createConnection({
host: 'localhost',
user: 'root',
password: process.env.DB_PASSWORD,
database: 'gestion_clientes'
});

db.connect((err) => {
if (err) {
console.error('Error al conectar con MySQL:', err.message);
return;
}
console.log('Conexión exitosa con MySQL');
});
// Permite recibir datos en formato JSON
app.use(express.json());

// Ruta inicial para comprobar la API
app.get('/', (req, res) => {
res.json({
mensaje: 'API de clientes funcionando correctamente'
});
});
// Ruta para obtener todos los clientes
app.get('/clientes', (req, res) => {
db.query('SELECT * FROM clientes', (err, resultados) => {
if (err) {
return res.status(500).json({
error: 'Error al consultar los clientes'
});
}

res.json(resultados);
});
});
// Ruta para agregar un nuevo cliente
app.post('/clientes', (req, res) => {
const { nombre, email, telefono } = req.body;

if (!nombre || !email) {
return res.status(400).json({
error: 'Nombre y email son obligatorios'
});
}

const sql = 'INSERT INTO clientes (nombre, email, telefono) VALUES (?, ?, ?)';

db.query(sql, [nombre, email, telefono || null], (err, resultado) => {
if (err) {
return res.status(500).json({
error: 'Error al agregar cliente'
});
}

res.status(201).json({
mensaje: 'Cliente agregado correctamente',
id_cliente: resultado.insertId
});
});
});
// Actualizar un cliente
app.put('/clientes/:id', (req, res) => {
const { id } = req.params;
const { nombre, email, telefono } = req.body;

if (!nombre || !email) {
return res.status(400).json({
error: 'Nombre y email son obligatorios'
});
}

const sql = 'UPDATE clientes SET nombre = ?, email = ?, telefono = ? WHERE id_cliente = ?';

db.query(sql, [nombre, email, telefono || null, id], (err, resultado) => {
if (err) {
return res.status(500).json({
error: 'Error al actualizar cliente'
});
}

if (resultado.affectedRows === 0) {
return res.status(404).json({
error: 'Cliente no encontrado'
});
}

res.json({
mensaje: 'Cliente actualizado correctamente'
});
});
});
// Eliminar un cliente
app.delete('/clientes/:id', (req, res) => {
const { id } = req.params;

const sql = 'DELETE FROM clientes WHERE id_cliente = ?';

db.query(sql, [id], (err, resultado) => {
if (err) {
return res.status(500).json({
error: 'Error al eliminar cliente'
});
}

if (resultado.affectedRows === 0) {
return res.status(404).json({
error: 'Cliente no encontrado'
});
}

res.json({
mensaje: 'Cliente eliminado correctamente'
});
});
});
// Iniciar el servidor
app.listen(PORT, () => {
console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
