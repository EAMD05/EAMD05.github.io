"use strict";

import express from "express";
import fs from 'fs';
import mockItems from './data/mockItems.js';
import mockUsers from './data/mockUsers.js';
import { 
    validateItem, 
    isDuplicate,
    validateUser,
    isDuplicateUser,
    validateUserItems 
} from './data/validators.js';

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

// Endpoint DELETE /items/:id
app.delete('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const itemIndex = items.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
        return res.status(404).json({ message: "Item not found" });
    }

    // Remove the item
    items.splice(itemIndex, 1);
    res.status(200).json({ message: "Item deleted" });
});

// Endpoint GET /users
app.get('/users', (req, res) => {
    if (users.length === 0) {
        return res.status(404).json({ message: "No users available" });
    }

    // Map users and expand their items, filtering out non-existent items
    const usersWithItems = users.map(user => {
        const userItems = user.items
            .map(itemId => items.find(i => i.id === itemId))
            .filter(item => item !== undefined);

        return {
            ...user,
            items: userItems
        };
    });

    res.status(200).json(usersWithItems);
});

// Endpoint GET /users/:id
app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(user => user.id === userId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Expand item details and filter out non-existent items
    const userItems = user.items
        .map(itemId => items.find(i => i.id === itemId))
        .filter(item => item !== undefined);

    // Return user data with expanded items
    res.status(200).json({
        ...user,
        items: userItems
    });
});

// Endpoint POST /users
app.post('/users', (req, res) => {
    const newUser = req.body;
    
    // Validate the user
    const validation = validateUser(newUser);
    if (!validation.isValid) {
        return res.status(400).json({ message: "Incomplete data or item does not exist" });
    }

    // Check for duplicate ID
    if (isDuplicateUser(users, newUser)) {
        return res.status(400).json({ message: "Incomplete data or item does not exist" });
    }

    // Validate that all item IDs exist
    if (!validateUserItems(items, newUser.items)) {
        return res.status(400).json({ message: "Incomplete data or item does not exist" });
    }

    // Add the new user
    users.push(newUser);
    res.status(201).json({ message: "User added successfully" });
});

// Endpoint PUT /users/:id
app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const updates = req.body;
    const userIndex = users.findIndex(user => user.id === userId);

    // Check if user exists
    if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
    }

    // Create a copy of the current user to update
    const updatedUser = { ...users[userIndex] };
    
    // Update name if provided
    if (updates.name) {
        updatedUser.name = updates.name;
    }
    
    // Update email if provided
    if (updates.email) {
        updatedUser.email = updates.email;
    }
    
    // Update items if provided
    if (updates.items) {
        // Convert items to array if it's a string
        let newItems = updates.items;
        if (typeof newItems === 'string') {
            newItems = newItems.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
        }
        
        // Validate that all item IDs exist
        if (!validateUserItems(items, newItems)) {
            return res.status(400).json({ message: "One or more items do not exist" });
        }
        
        updatedUser.items = newItems;
    }
    
    // Update the user in the array
    users[userIndex] = updatedUser;
    
    res.status(200).json({ message: "User updated" });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
