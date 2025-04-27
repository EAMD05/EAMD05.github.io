"use strict";

import express from "express";
import fs from 'fs';
import mockItems from './data/mockItems.js';
import mockUsers from './data/mockUsers.js';
//import { validateItem, validateUser, isDuplicate } from './data/validators.js';

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
