const rickAndMortyApi = 'https://rickandmortyapi.com/api/character/';
const characters = [];
let status = document.querySelector('input[type=radio]:checked').value;
let wordToMatch = '';

fetch(rickAndMortyApi)
  .then(res => res.json())
  .then(data => characters.push(...data.results));

function findMatches(wordToMatch, status, characters) {
  return characters.filter(character => {
    // here we need to figure out if the character matches what was searched
    const regex = new RegExp(wordToMatch, 'gi');
    // return character.name.match(regex);
    const statusRegex = new RegExp(status, 'gi');
    return (character.name.match(regex) && character.status.match(statusRegex));
  })
}

function displayMatches() {
  const matchArray = findMatches(wordToMatch, status, characters);
  const html = matchArray.map(character => {
    return `
      <li>
        <img class="image" src=${character.image} alt="image">
        <h3 class="name">${character.name}</h3>
        <p class="status">${character.status}</p>
      </li>
    `;
  }).join('');
  result.innerHTML = html;
}

function updateStatus() {
  this.checked = true;
  status = this.value;
  displayMatches();
}

function updateWordToMatch() {
  wordToMatch = this.value;
  displayMatches();
}

const searchInput = document.querySelector('.search');
const result = document.querySelector('.characters');
const statusButtons = document.querySelectorAll('input[type=radio]');

searchInput.addEventListener('change', updateWordToMatch);
searchInput.addEventListener('keyup', updateWordToMatch);
statusButtons.forEach(button => button.addEventListener('click', updateStatus));