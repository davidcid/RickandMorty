// URL to the characters API
const rickAndMortyApi = 'https://rickandmortyapi.com/api/character/';

const searchInput =       document.querySelector('.search');
const result =            document.querySelector('.characters');
const statusButtons =     document.querySelectorAll('input[type=radio]');
let status =              document.querySelector('input[type=radio]:checked').value; // starts with "alive"
let wordToMatch = '';
let id = null;

// get the data from de API
async function getData() {
  try {
    const response = await fetch(`${rickAndMortyApi}?page=1&name=${wordToMatch}&status=${status}`);
    const data = await response.json();
    let characters = [];

    // look up all pages and store data in "characters"
    for(let page = 1; page <= data.info.pages; page++) {
      fetch(`${rickAndMortyApi}?page=${page}&name=${wordToMatch}&status=${status}`)
      .then(res => res.json())
      .then(data => {
        characters.push(...data.results);
        // sort the cards to show on the page
        characters.sort((a, b) => a.id > b.id ? 1 : -1);
        displayMatches(characters);
      })
      .catch(err => {
        result.innerHTML = `<p class="no-results">No results found</p>`;
      })
    }
    displayMatches(characters);
  } catch(error) {
    result.innerHTML = `<p class="no-results">No results found</p>`;
  }
}

// Insert the characteres in the HTML
function displayMatches(characters = []) {
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
  
  // create a listener to expand any card clicked
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => card.addEventListener('click', showDetails));
}

// when click another status, calls getData function with the new parameter
function updateStatus() {
  this.checked = true;
  status = this.value;
  getData();
}

// when change the search box, calls getData function with the new parameter
function updateWordToMatch() {
  setTimeout(() => {
    wordToMatch = this.value;
    getData();
  }, 1100);
  
}

// when click a card, call "getCharacterData" to show expanded info
function showDetails() {
  id = this.querySelector('.id').innerHTML;
  const characterExpanded = document.querySelector('.character-expanded');
  characterExpanded.addEventListener('click', toggleExpand);
  characterExpanded.classList.toggle("expanded");
  data = getCharacterData();
}

// add/remove the class "expanded"
function toggleExpand() {
  this.classList.toggle("expanded");
}

// get the details of the clicked character from the API and shows them in the HTML
async function getCharacterData() {
  try {
    const response = await fetch(`${rickAndMortyApi}${id}`);
    const data = await response.json();
    let episodes = [];
    data.episode.map(episode => {
      const number = episode.replace("https://rickandmortyapi.com/api/episode/", "");
      episodes.push(number);
    });
 
    const html = `
      <div class="ch-info">
        <h3>${data.name}</h3>
        <ul>
          <li><span class="info">Gender:</span> ${data.gender}</li>
          <li><span class="info">Specie:</span> ${data.species}</li>
          <li><span class="info">Origin:</span> ${data.origin.name}</li>
          <li><span class="info">Location:</span> ${data.location.name}</li>
          <li><span class="info">Type:</span> ${data.type}</li>
          <li><span class="info">Status:</span> ${data.status}</li>
          <li><span class="info">Episodes:</span> ${episodes.join(", ").toString()}</li>
        </ul>
      </div>
    `;
    
    // set the character image as the background and create the inner of the card
    const characterExpanded = document.querySelector('.character-expanded');
    characterExpanded.style.backgroundImage = `url(${data.image})`;
    characterExpanded.innerHTML = html;
    
  }
  catch(error) {
    result.innerHTML = `<p class="no-results">an error has occurred trying to get the information</p>`;
  }    
}

searchInput.addEventListener('keyup', updateWordToMatch);
statusButtons.forEach(button => button.addEventListener('click', updateStatus));