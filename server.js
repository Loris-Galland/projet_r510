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
const collectionName='pokedex'; 

// GET pour récupérer pokemons
app.get('/pokedex', async (req, res)=>{
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const typeQuery = req.query.type;
        let query = {};
        if (typeQuery) {
            // On cherche tous les Pokémon dont le tableau "type" contient ce type
            // $elemMatch permet de matcher un élément du tableau
            // $regex avec 'i' rend la recherche insensible à la casse
            query = { type: { $elemMatch: { $regex: new RegExp(`^${typeQuery}$`, 'i') } } }; //regex générée
        }
        const pokemons=await collection.find(query).toArray();
        res.json(pokemons);
    }catch (err){
        console.error(err);
        res.status(500).send('erreur serveur');
    }
});

app.use(express.static(path.join(__dirname, 'public')));

const PORT=3000;
app.listen(PORT, () => {
    console.log(`Server run sur http://localhost:${PORT}`);
});
