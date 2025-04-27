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

// API Endpoint para obtener todos los items
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

// API Endpoint para obtener un item por ID
app.get('/items/:id', (req, res) => {
    try {
        const itemId = parseInt(req.params.id);
        const item = mockItems.find(item => item.id === itemId);
        
        if (!item) {
            return res.status(404).json({ message: "Item no encontrado" });
        }
        
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

// API Endpoint para registrar items
app.post('/items', (req, res) => {
    try {
        const items = req.body;
        
        // Verificar si es un array o un solo item
        const itemsToAdd = Array.isArray(items) ? items : [items];
        
        // Validar cada item
        for (const item of itemsToAdd) {
            // Verificar atributos requeridos
            if (!item.id || !item.name || !item.type || !item.effect) {
                return res.status(400).json({ 
                    message: "Todos los items deben tener id, name, type y effect" 
                });
            }
            
            // Verificar si el ID ya existe
            if (mockItems.some(existingItem => existingItem.id === item.id)) {
                return res.status(400).json({ 
                    message: `Ya existe un item con el ID ${item.id}` 
                });
            }
        }
        
        // Agregar los items
        mockItems.push(...itemsToAdd);
        
        res.status(201).json({ 
            message: "Item(s) agregado(s) correctamente",
            items: itemsToAdd
        });
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

// API Endpoint para actualizar un item por ID
app.put('/items/:id', (req, res) => {
    try {
        const itemId = parseInt(req.params.id);
        const updates = req.body;
        
        // Verificar si el item existe
        const itemIndex = mockItems.findIndex(item => item.id === itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item no encontrado" });
        }
        
        // Actualizar solo los campos enviados
        const updatedItem = { ...mockItems[itemIndex] };
        if (updates.name) updatedItem.name = updates.name;
        if (updates.type) updatedItem.type = updates.type;
        if (updates.effect) updatedItem.effect = updates.effect;
        
        // Reemplazar el item en el array
        mockItems[itemIndex] = updatedItem;
        
        res.status(200).json({ 
            message: "Item actualizado correctamente",
            item: updatedItem
        });
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

// API Endpoint para eliminar un item por ID
app.delete('/items/:id', (req, res) => {
    try {
        const itemId = parseInt(req.params.id);
        
        // Verificar si el item existe
        const itemIndex = mockItems.findIndex(item => item.id === itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item no encontrado" });
        }
        
        // Eliminar el item del array
        mockItems.splice(itemIndex, 1);
        
        res.status(200).json({ message: "Item eliminado" });
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

// Ruta para la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});

// Ruta para la página de items
app.get('/items-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'items.html'));
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
    console.log('Items cargados:', mockItems.length);
});
