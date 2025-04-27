"use strict";

import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import mockItems from './data/mockItems.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Endpoint para obtener los items
app.get('/api/items', (req, res) => {
    try {
        const items = mockItems;
        
        if (!items || items.length === 0) {
            return res.status(404).json({ message: "No hay items disponibles" });
        }
        
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

// Ruta para la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});

// Ruta para la página de items
app.get('/items', (req, res) => {
    try {
        const items = mockItems;
        
        if (!items || items.length === 0) {
            return res.status(404).json({ message: "No hay items disponibles" });
        }
        
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
    console.log('Items cargados:', mockItems.length);
});
