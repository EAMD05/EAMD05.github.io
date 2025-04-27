"use strict";

import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import mockItems from './data/mockItems.js';
import mockUsers from './data/mockUsers.js';

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

// API Endpoint para obtener todos los usuarios
app.get('/users', (req, res) => {
    try {
        if (!mockUsers || mockUsers.length === 0) {
            return res.status(404).json({ message: "No hay usuarios" });
        }
        
        res.json(mockUsers);
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

// API Endpoint para obtener un usuario por ID
app.get('/users/:id', (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const user = mockUsers.find(user => user.id === userId);
        
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

// API Endpoint para registrar usuarios
app.post('/users', (req, res) => {
    try {
        const users = req.body;
        
        // Verificar si es un array o un solo usuario
        const usersToAdd = Array.isArray(users) ? users : [users];
        
        // Validar cada usuario
        for (const user of usersToAdd) {
            // Verificar atributos requeridos
            if (!user.id || !user.name || !user.email || !Array.isArray(user.items)) {
                return res.status(400).json({ 
                    message: "Todos los usuarios deben tener id, name, email y items (array)" 
                });
            }
            
            // Verificar si el ID ya existe
            if (mockUsers.some(existingUser => existingUser.id === user.id)) {
                return res.status(400).json({ 
                    message: `Ya existe un usuario con el ID ${user.id}` 
                });
            }
            
            // Verificar que todos los items existan en el catálogo y obtener sus detalles completos
            const completeItems = [];
            for (const item of user.items) {
                const catalogItem = mockItems.find(existingItem => existingItem.id === item.id);
                if (!catalogItem) {
                    return res.status(400).json({ 
                        message: `El item con ID ${item.id} no existe en el catálogo` 
                    });
                }
                completeItems.push(catalogItem);
            }
            
            // Reemplazar los items con sus detalles completos
            user.items = completeItems;
        }
        
        // Agregar los usuarios
        mockUsers.push(...usersToAdd);
        
        res.status(201).json({ 
            message: "Usuario(s) agregado(s) correctamente",
            users: usersToAdd
        });
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

// PUT /users/:id - Actualizar usuario por ID
app.put('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = mockUsers.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    const { name, email, items } = req.body;
    const updatedUser = { ...mockUsers[userIndex] };

    if (name) {
        updatedUser.name = name;
    }

    if (email) {
        updatedUser.email = email;
    }

    if (items) {
        // Verificar que todos los items existan y obtener sus detalles completos
        const completeItems = [];
        for (const itemId of items) {
            const catalogItem = mockItems.find(item => item.id === itemId);
            if (!catalogItem) {
                return res.status(400).json({ error: 'One or more items do not exist' });
            }
            completeItems.push(catalogItem);
        }
        updatedUser.items = completeItems;
    }

    mockUsers[userIndex] = updatedUser;
    res.status(200).json(updatedUser);
});

// DELETE /users/:id - Borrar usuario por ID
app.delete('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = mockUsers.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Eliminar el usuario del array
    mockUsers.splice(userIndex, 1);
    res.status(200).json({ message: 'User deleted successfully' });
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
