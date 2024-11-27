const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = './backend/reservas.json';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Ruta para obtener las reservas
app.get('/reservas', (req, res) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) return res.status(500).json({ error: 'Error leyendo las reservas' });
        res.json(JSON.parse(data || '[]'));
    });
});

// Ruta para agregar una nueva reserva
app.post('/reservas', (req, res) => {
    const nuevaReserva = req.body;

    fs.readFile(DATA_FILE, (err, data) => {
        if (err) return res.status(500).json({ error: 'Error leyendo las reservas' });
        const reservas = JSON.parse(data || '[]');
        reservas.push(nuevaReserva);
        fs.writeFile(DATA_FILE, JSON.stringify(reservas), (err) => {
            if (err) return res.status(500).json({ error: 'Error guardando la reserva' });
            res.status(201).json(nuevaReserva);
        });
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
