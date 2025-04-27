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
app.get('/api/items', (req, res) => {
    if (mockItems.length === 0) {
        return res.status(404).json({ error: 'No items available' });
    }
    res.json(mockItems);
});

// API Endpoint para obtener un item por ID
app.get('/api/items/:id', (req, res) => {
    try {
        const itemId = parseInt(req.params.id);
        const item = mockItems.find(item => item.id === itemId);
        
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// API Endpoint para registrar items
app.post('/api/items', (req, res) => {
    try {
        const items = req.body;
        
        // Verificar si es un array o un solo item
        const itemsToAdd = Array.isArray(items) ? items : [items];
        
        // Validar cada item
        for (const item of itemsToAdd) {
            // Verificar atributos requeridos
            if (!item.id || !item.name || !item.type || !item.effect) {
                return res.status(400).json({ 
                    message: "All items must have id, name, type and effect" 
                });
            }
            
            // Verificar si el ID ya existe
            if (mockItems.some(existingItem => existingItem.id === item.id)) {
                return res.status(400).json({ 
                    message: `An item with ID ${item.id} already exists` 
                });
            }
        }
        
        // Agregar los items
        mockItems.push(...itemsToAdd);
        
        res.status(201).json({ 
            message: "Item(s) added successfully",
            items: itemsToAdd
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// API Endpoint para actualizar un item por ID
app.put('/api/items/:id', (req, res) => {
    try {
        const itemId = parseInt(req.params.id);
        const updates = req.body;
        
        // Verificar si el item existe
        const itemIndex = mockItems.findIndex(item => item.id === itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found" });
        }
        
        // Actualizar solo los campos enviados
        const updatedItem = { ...mockItems[itemIndex] };
        if (updates.name) updatedItem.name = updates.name;
        if (updates.type) updatedItem.type = updates.type;
        if (updates.effect) updatedItem.effect = updates.effect;
        
        // Reemplazar el item en el array
        mockItems[itemIndex] = updatedItem;

        // Actualizar el item en todos los usuarios que lo tengan
        mockUsers.forEach(user => {
            const itemIndex = user.items.findIndex(item => item.id === itemId);
            if (itemIndex !== -1) {
                user.items[itemIndex] = updatedItem;
            }
        });
        
        res.status(200).json({ 
            message: "Item updated successfully",
            item: updatedItem
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// API Endpoint para eliminar un item por ID
app.delete('/api/items/:id', (req, res) => {
    try {
        const itemId = parseInt(req.params.id);
        
        // Verificar si el item existe
        const itemIndex = mockItems.findIndex(item => item.id === itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found" });
        }
        
        // Eliminar el item del array
        mockItems.splice(itemIndex, 1);

        // Eliminar el item de todos los usuarios que lo tengan
        mockUsers.forEach(user => {
            user.items = user.items.filter(item => item.id !== itemId);
        });
        
        res.status(200).json({ message: "Item deleted" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// API Endpoint para obtener todos los usuarios
app.get('/api/users', (req, res) => {
    try {
        if (!mockUsers || mockUsers.length === 0) {
            return res.status(404).json({ message: "No users" });
        }
        
        res.json(mockUsers);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// API Endpoint para obtener un usuario por ID
app.get('/api/users/:id', (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const user = mockUsers.find(user => user.id === userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// API Endpoint para registrar usuarios
app.post('/api/users', (req, res) => {
    try {
        const users = req.body;
        
        // Verificar si es un array o un solo usuario
        const usersToAdd = Array.isArray(users) ? users : [users];
        
        // Validar cada usuario
        for (const user of usersToAdd) {
            // Verificar atributos requeridos
            if (!user.id || !user.name || !user.email) {
                return res.status(400).json({ 
                    message: "All users must have id, name and email" 
                });
            }
            
            // Verificar si el ID ya existe
            if (mockUsers.some(existingUser => existingUser.id === user.id)) {
                return res.status(400).json({ 
                    message: `A user with ID ${user.id} already exists` 
                });
            }
            
            // Procesar los items
            let items = [];
            if (user.items) {
                // Si items es un string (IDs separados por comas), convertirlo a array
                if (typeof user.items === 'string') {
                    items = user.items.split(',').map(id => parseInt(id.trim()));
                } else if (Array.isArray(user.items)) {
                    // Si items es un array, extraer los IDs
                    items = user.items.map(item => {
                        if (typeof item === 'object' && item !== null) {
                            return item.id;
                        } else if (typeof item === 'number') {
                            return item;
                        }
                        return null;
                    }).filter(id => id !== null);
                }
                
                // Verificar que todos los items existan en el catálogo y obtener sus detalles completos
                const completeItems = [];
                for (const itemId of items) {
                    const catalogItem = mockItems.find(existingItem => existingItem.id === itemId);
                    if (!catalogItem) {
                        return res.status(400).json({ 
                            message: `The item with ID ${itemId} does not exist in the catalog` 
                        });
                    }
                    completeItems.push(catalogItem);
                }
                
                // Reemplazar los items con sus detalles completos
                user.items = completeItems;
            } else {
                // Si no se proporcionan items, inicializar como array vacío
                user.items = [];
            }
        }
        
        // Agregar los usuarios
        mockUsers.push(...usersToAdd);
        
        res.status(201).json({ 
            message: "User(s) added successfully",
            users: usersToAdd
        });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ message: "Internal server error" });
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
