const rickAndMortyApi = 'https://rickandmortyapi.com/api/character/';

const searchInput =   document.querySelector('.search');
const result =        document.querySelector('.characters');
const statusButtons = document.querySelectorAll('input[type=radio]');


let status =          document.querySelector('input[type=radio]:checked').value;
let wordToMatch = 'morty';


// function getData(wordToMatch, status) {
//   fetch(`${rickAndMortyApi}?page=1&name=${wordToMatch}&status=${status}`)
//   .then(res => res.json())
//   .then(data => {
//     let characters = data.results;
//     const totalPages = data.info.pages;

//     if(totalPages > 1) {
//       for(let page = 2; page <= totalPages; page++) {
//         fetch(`${rickAndMortyApi}?page=${page}&name=${wordToMatch}&status=${status}`)
//           .then(res => res.json())
//           .then(data => {
//             // characters = characters.concat(data.results);
//             characters.push(...data.results);
//             if(page === totalPages) {
//               displayMatches(characters);
//             }
//           })
//           .catch(err => {
//             result.innerHTML = `<p class="no-results">No se han encontrado resultados</p>`;
//           })
//       }
//     } else {
//       displayMatches(characters);
//     }
//   })
//   .catch(err => {
//     result.innerHTML = `<p class="no-results">No se han encontrado resultados</p>`;
//   })
// }

async function getData() {
  try {
    let response = await fetch(`${rickAndMortyApi}?page=1&name=${wordToMatch}&status=${status}`);
    let data = await response.json();
    let characters = data.results;
    const totalPages = data.info.pages;
    if(totalPages > 1) {
      for(let page = 2; page <= totalPages; page++) {
        fetch(`${rickAndMortyApi}?page=${page}&name=${wordToMatch}&status=${status}`)
          .then(res => res.json())
          .then(data => {
            // characters = characters.concat(data.results);
            characters.push(...data.results);
            if(page === totalPages) {
              displayMatches(characters);
            }
          })
          .catch(err => {
            result.innerHTML = `<p class="no-results">No se han encontrado resultados</p>`;
          })
      }
    } else {
      displayMatches(characters);
    } 
  } catch(error) {
    result.innerHTML = `<p class="no-results">No se han encontrado resultados</p>`;
  }
}

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
  const cards =         document.querySelectorAll('.card');
  cards.forEach(card => card.addEventListener('click', showDetails));
}

function updateStatus() {
  this.checked = true;
  status = this.value;
  getData();
}

function updateWordToMatch() {
  wordToMatch = this.value;
  setTimeout(getData, 5000);
}

function showDetails() {
  id = this.querySelector('.id').innerHTML;
  console.log(id);
  getCharacterData();
}

async function getCharacterData() {
  try {
    let response = await fetch(`${rickAndMortyApi}${id}`);
    let data = await response.json();
    console.log(data);
  }
  catch(error) {
    result.innerHTML = `<p class="no-results">No se han encontrado resultados</p>`;
  }    
}

getData();




searchInput.addEventListener('change', updateWordToMatch);
searchInput.addEventListener('keyup', updateWordToMatch);
statusButtons.forEach(button => button.addEventListener('click', updateStatus));