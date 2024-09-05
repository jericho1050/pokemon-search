const getEl = (element) => document.querySelector(element);

class App {
  constructor() {
    // states
    this.query; // user's input
    this.addEventListener(); // binds event
  }

  handleClick = async (event) => {
    event.preventDefault();
    // handle search logic here
    this.query = getEl('#search-input').value;

    if (this.query) {
      const data = await this.getPokemon(this.query.toLowerCase());
      this.render(null); // clear the element content between searches
      if (!data) {
        alert('Pokémon not found');
        return;
      }
      this.render(data);
    }
  };

  getPokemon = async (query) => {
    console.log(query);
    try {
      const response = await fetch(
        `https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/${query}`,
        {
          method: 'GET',
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error: ', error);
      console.log('No pokemon found');
      return null;
    }
  };

  render = (data) => {
    // renders UI & data
    if (!data) {
      // reset the UI & empty the element contents
      const statsArr = [
        '#pokemon-name',
        '#pokemon-id',
        '#weight',
        '#height',
        '#hp',
        '#attack',
        '#defense',
        '#special-attack',
        '#special-defense',
        '#speed',
      ];
      const $leftCol = getEl('.left-col');
      $leftCol.classList.add('empty');
      $leftCol.firstElementChild.classList.remove('sprite-container');
      getEl('#pokemon-name').innerHTML = '';
      getEl('#pokemon-id').innerHTML = '';
      getEl('#weight').innerHTML = '';
      getEl('#height').innerHTML = '';
      statsArr.forEach((stat) => {
        getEl(stat).textContent = '';
      });
      getEl('#sprite').src = '';
      const $ul = getEl('#types');
      $ul.innerHTML = ''; // Clear all list items
    } else {
      const { name, id, weight, height, stats, sprites, types } = data;
      const $leftCol = getEl('.left-col');
      $leftCol.classList.remove('empty');
      $leftCol.firstElementChild.classList.add('sprite-container');
      getEl('#pokemon-name').innerHTML = name.toUpperCase();
      getEl('#pokemon-id').innerHTML = '#' + id;
      getEl('#weight').innerHTML = `Weight: ${weight}`;
      getEl('#height').innerHTML = `Height: ${height}`;
      stats.forEach((stat) => {
        getEl(`#${stat.stat.name}`).innerHTML = stat.base_stat;
      });
      getEl('#sprite').src = sprites.front_default;
      const $ul = getEl('#types');
      types.forEach((type) => {
        const typeName = type.type.name;
        const $li = document.createElement('li');
        $li.textContent = typeName;
        $li.className = typeName;
        $ul.appendChild($li);
      });
    }
  };
  addEventListener() {
    getEl('#search-button').addEventListener('click', (event) =>
      this.handleClick(event)
    );
  }
}

new App();
