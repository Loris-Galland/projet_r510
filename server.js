// IMPORTS ET CONFIGURATION

const express = require('express'); //créer serveur web
const cors = require('cors'); //auth request cross-origin
const path = require('path');
const { initMongo } = require('./db/mongo');

// ROUTING
const pokedexRoutes = require('./routes/pokedex');
const itemRoutes = require('./routes/items');
const moveRoutes = require('./routes/moves');
const typeRoutes = require('./routes/types');
const itemRoute = require('./routes/item');
const pokemonRoutes = require('./routes/pokemon')
const newPokemonRoute = require('./routes/newPokemon');

const app = express();
app.use(cors());
app.use(express.json());

// Use routes
app.use('/pokedex', pokedexRoutes);
app.use('/items', itemRoutes);
app.use('/moves', moveRoutes);
app.use('/types', typeRoutes);
app.use('/item', itemRoute);
app.use('/pokemon', pokemonRoutes)
app.use('/new-pokemon', newPokemonRoute);

// Files static
app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3000;
app.listen(PORT, async () => {
  await initMongo();
  console.log(`Serveur online : http://localhost:${PORT}`);
});
