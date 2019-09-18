const rickAndMortyApi = 'https://rickandmortyapi.com/api/character/';

const searchInput =       document.querySelector('.search');
const result =            document.querySelector('.characters');
const statusButtons =     document.querySelectorAll('input[type=radio]');
let status =              document.querySelector('input[type=radio]:checked').value;
let wordToMatch = '';
let id = null;

async function getData() {
  try {
    const response = await fetch(`${rickAndMortyApi}?page=1&name=${wordToMatch}&status=${status}`);
    const data = await response.json();
    let characters = [];

    for(let page = 1; page <= data.info.pages; page++) {
      setTimeout(() => {
        fetch(`${rickAndMortyApi}?page=${page}&name=${wordToMatch}&status=${status}`)
        .then(res => res.json())
        .then(data => {
          // characters = characters.concat(data.results);
          characters.push(...data.results);
          if(page === data.info.pages) {
            displayMatches(characters);
          }
        })
        .catch(err => {
          result.innerHTML = `<p class="no-results">No se han encontrado resultados</p>`;
        })
      }, 1800)
    }
    

  } catch(error) {
    console.log(error);
    result.innerHTML = `<p class="no-results">No se han encontrado resultados</p>`;
  }
}

function displayMatches(characters = []) {
  console.log(characters);
  const html = characters.map(character => {
    return `
      <li class="card">
        <img class="image" src=${character.image} alt="image">
        <h3 class="name">#<span class="id">${character.id}</span> - ${character.name}</h3>
        <p class="status ${character.status}">${character.status}</p>
      </li>
    `;
  }).join('');
  result.innerHTML = html;
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => card.addEventListener('click', showDetails));
}

function updateStatus() {
  this.checked = true;
  status = this.value;
  getData();
}

function updateWordToMatch() {
  wordToMatch = this.value;
  setTimeout(getData, 800);
}

function showDetails() {
  id = this.querySelector('.id').innerHTML;
  const characterExpanded = document.querySelector('.character-expanded');
  characterExpanded.addEventListener('click', toggleExpand);
  characterExpanded.classList.toggle("expanded");
  data = getCharacterData();
}

function toggleExpand() {
  this.classList.toggle("expanded");
}

async function getCharacterData() {
  try {
    const response = await fetch(`${rickAndMortyApi}${id}`);
    const data = await response.json();
    let episodes = [];
    data.episode.map(episode => {
      const number = episode.replace("https://rickandmortyapi.com/api/episode/", "");
      episodes.push(number);
    });
    // const episodesString = episodes.join(", ").toString();
    // console.log(episodesString);
       
    const html = `
      <h3>${data.name}</h3>
      <ul>
        <li>Gender: ${data.gender}</li>
        <li>Specie: ${data.species}</li>
        <li>Origin: ${data.origin.name}</li>
        <li>Location: ${data.location.name}</li>
        <li>Type: ${data.type}</li>
        <li>Status: ${data.status}</li>
        <li>Episodes: ${episodes.join(", ").toString()}</li>
      </ul>
    `;
    
    const characterExpanded = document.querySelector('.character-expanded');
    characterExpanded.style.backgroundImage = `url(${data.image})`;
    characterExpanded.innerHTML = html;
    
  }
  catch(error) {
    result.innerHTML = `<p class="no-results">No se han encontrado resultados</p>`;
  }    
}


getData();




searchInput.addEventListener('change', updateWordToMatch);
searchInput.addEventListener('keyup', updateWordToMatch);
statusButtons.forEach(button => button.addEventListener('click', updateStatus));