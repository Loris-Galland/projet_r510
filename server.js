// IMPORTS ET CONFIGURATION

const express = require('express'); //créer serveur web
const cors = require('cors'); //auth request cross-origin
const path = require('path');
const { initMongo } = require('./db/mongo');

// ROUTING
const pokedexRoutes = require('./routes/pokedex');
const itemRoutes = require('./routes/items');
const movesRoutes = require('./routes/moves');
const typesRoutes = require('./routes/types');
const typeRoute = require('./routes/type');
const itemRoute = require('./routes/item');
const moveRoutes = require('./routes/move');
const pokemonRoutes = require('./routes/pokemon')
const newPokemonRoute = require('./routes/newPokemon');
const newItemRoute = require('./routes/newItem');
const newMoveRoute = require('./routes/newMove');
const newTypeRoute = require('./routes/newType');

// APP INITIALIZATION
const app = express();
app.use(cors());
app.use(express.json());

// Use routes
app.use('/pokedex', pokedexRoutes);
app.use('/items', itemRoutes);
app.use('/moves', movesRoutes);
app.use('/types', typesRoutes);
app.use('/type', typeRoute);
app.use('/item', itemRoute);
app.use('/pokemon', pokemonRoutes);
app.use('/move', moveRoutes);
app.use('/new-pokemon', newPokemonRoute);
app.use('/new-item', newItemRoute);
app.use('/new-move', newMoveRoute);
app.use('/new-type', newTypeRoute);

// Files static
app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3000;
app.listen(PORT, async () => {
  await initMongo();
  console.log(`Serveur online : http://localhost:${PORT}`);
});
