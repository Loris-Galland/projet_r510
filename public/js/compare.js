import { currentLang } from "./i18n.js";

const BASE_API = "http://localhost:3000";
const BASE_POKEDEX = `${BASE_API}/pokedex`;
const BASE_COMPARE = `${BASE_API}/compare`;

// Charger listes déroulantes
async function loadLists() {
  const res = await fetch(BASE_POKEDEX);
  const pokemons = await res.json();

  const s1 = document.getElementById("selectPokemon1");
  const s2 = document.getElementById("selectPokemon2");

  pokemons.forEach(p => {
    const opt1 = document.createElement("option");
    opt1.value = p._id;
    opt1.textContent = p.name[currentLang] || p.name.french;
    s1.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = p._id;
    opt2.textContent = p.name[currentLang] || p.name.french;
    s2.appendChild(opt2);
  });
}

// Cliquer sur comparer
document.getElementById("compareBtn").addEventListener("click", async () => {
  const id1 = document.getElementById("selectPokemon1").value;
  const id2 = document.getElementById("selectPokemon2").value;

  if (!id1 || !id2) {
    alert("Sélectionne deux Pokémon !");
    return;
  }

  const res = await fetch(`${BASE_COMPARE}?id1=${id1}&id2=${id2}`);
  const { pokemon1, pokemon2, comparison } = await res.json();

  // Construction affichage
  let html = `
    <div class="compare-cards">
      <div class="card">
        <h2>${pokemon1.name[currentLang]}</h2>
        <img src="${pokemon1.image.sprite}">
        <p>${pokemon1.type.join(", ")}</p>
      </div>

      <div class="card">
        <h2>${pokemon2.name[currentLang]}</h2>
        <img src="${pokemon2.image.sprite}">
        <p>${pokemon2.type.join(", ")}</p>
      </div>
    </div>

    <h2>Comparatif Statistiques</h2>
    <table>
      <tr><th>Stat</th><th>${pokemon1.name.french}</th><th>${pokemon2.name.french}</th><th>Meilleur</th></tr>
  `;

  for (const k in comparison) {
    const row = comparison[k];
    html += `
      <tr>
        <td>${k}</td>
        <td>${row.p1}</td>
        <td>${row.p2}</td>
        <td>${row.winner}</td>
      </tr>
    `;
  }

  html += `</table>`;
  document.getElementById("compare-container").innerHTML = html;
});

loadLists();
