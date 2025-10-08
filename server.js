// server.js
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const url='mongodb://localhost:27017';
const client=new MongoClient(url);
const dbName='projet_r510'; 
let db;

async function initMongo() {
  try {
    await client.connect();
    db= client.db(dbName);
    console.log('Connecté à MongoDB');
  } catch (err) {
    console.error('Erreur de connexion MongoDB :', err);
  }
}

// GET pour récupérer pokemons
app.get('/pokedex', async (req, res)=>{
    try {
        const collection = db.collection('pokedex');
        const typeQuery = req.query.type;
        let query = {};
        if (typeQuery) {
            // On cherche tous les Pokémon dont le tableau "type" contient ce type
            // $elemMatch permet de matcher un élément du tableau
            query = { type: { $elemMatch: { $regex: new RegExp(`^${typeQuery}$`, 'i') } } };
        }
        
        const pokemons=await collection.find(query).toArray();
        res.json(pokemons);
    }catch (err){
        console.error(err);
        res.status(500).send('erreur serveur');
    }
});

app.get('/items',async (req,res)=>{
    try {
        const collection = db.collection('items');
        const typeQuery=req.query.type;
        let query={};
        if (typeQuery) {
            // On enlève le $elemMatch car c'est un String
            query = { type: { $regex: new RegExp(`^${typeQuery}$`, 'i')}};
        }
        const items=await collection.find(query).toArray();
        res.json(items);
    } catch (err){
        console.error(err);
        res.status(500).send('erreur serveur');
    }
});

app.use(express.static(path.join(__dirname, 'public')));

const PORT=3000;
app.listen(PORT, () => {
    initMongo();
    console.log(`Server run sur http://localhost:${PORT}`);
});
