const rickAndMortyApi = 'https://rickandmortyapi.com/api/character/';
  const characters = [];

  fetch(rickAndMortyApi)
    .then(res => res.json())
    .then(data => characters.push(...data.results));

  function findMatches(wordToMatch, characters) {
    return characters.filter(character => {
      // here we need to figure out if the character matches what was searched
      const regex = new RegExp(wordToMatch, 'gi');
      return character.name.match(regex);
    })
  }

  function displayMatches() {
    const matchArray = findMatches(this.value, characters);
    const html = matchArray.map(character => {
      // const regex = new RegExp(this.value, 'gi');
      const characterName = character.name;
      return `
        <li>
          <span class="name">${characterName}</span>
        </li>
      `;
    }).join('');
    result.innerHTML = html;
  }

  const searchInput = document.querySelector('.search');
  const result = document.querySelector('.characters');

  searchInput.addEventListener('change', displayMatches);
  searchInput.addEventListener('keyup', displayMatches);