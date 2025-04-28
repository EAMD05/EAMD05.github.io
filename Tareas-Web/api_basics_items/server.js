"use strict";

import express from "express";
import fs from 'fs';
import mockItems from './data/mockItems.js';
import mockUsers from './data/mockUsers.js';
import { validateItem, isDuplicate } from './data/validators.js';

const port = 3000;
const app = express();

// Arrays that will store the data (initialized with test data)
let items = [...mockItems];
let users = [...mockUsers];

app.use(express.json());

app.use(express.static('./public'));

app.get('/', (req, res)=>{
    fs.readFile('./public/html/index.html', 'utf8',
        (err,html)=>{
            if(err){
            res.status(500).send('There was an error: '
                +err)
                return
            }
            
            console.log("Sending page...")
            res.send(html)
            console.log("Page sent!")

        }
        
    )

})

// Endpoint GET /items
app.get('/items', (req, res) => {
    if (items.length === 0) {
        res.status(404).json({ message: "No items available" });
    } else {
        res.status(200).json(items);
    }
});

// Endpoint GET /items/:id
app.get('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const item = items.find(item => item.id === itemId);

    if (!item) {
        res.status(404).json({ message: "Item not found" });
    } else {
        res.status(200).json({
            id: item.id,
            name: item.name,
            type: item.type,
            effect: item.effect
        });
    }
});

// Endpoint POST /items
app.post('/items', (req, res) => {
    const newItem = req.body;
    
    // Validate the item
    const validation = validateItem(newItem);
    if (!validation.isValid) {
        return res.status(400).json({ message: validation.message });
    }

    // Check for duplicate ID
    if (isDuplicate(items, newItem)) {
        return res.status(400).json({ message: "Item already exists" });
    }

    // Add the new item
    items.push(newItem);
    res.status(201).json({ message: "Item added successfully" });
});

// Endpoint PUT /items/:id
app.put('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const updates = req.body;
    const itemIndex = items.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
        return res.status(404).json({ message: "Item not found" });
    }

    // Update only the provided fields
    const updatedItem = { ...items[itemIndex] };
    if (updates.name) updatedItem.name = updates.name;
    if (updates.type) updatedItem.type = updates.type;
    if (updates.effect) updatedItem.effect = updates.effect;

    items[itemIndex] = updatedItem;
    res.status(200).json({ message: "Item updated" });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
