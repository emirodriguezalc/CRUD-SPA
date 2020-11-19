import './styles/main.scss';

let pageNumber = 1;
let totalPages;
let currentInput;
const form = document.querySelector('form');
const input = document.getElementById('search');
const ul = document.querySelector('ul');
const clearButton = document.getElementsByClassName('clear')[0];
const wrapper = document.getElementsByClassName('image-list')[0];
let itemsArray = localStorage.getItem('items')
  ? JSON.parse(localStorage.getItem('items'))
  : [];

const prev = document.getElementsByClassName('prev')[0];
const next = document.getElementsByClassName('next')[0];

const mock = require('./mock.json');

// ARREGLAR
// Limpiar las imagenes anteriores DONE
// que el boton prev no se desunablea DONE
// que no puedo pasarle el current value del input a la funcion de next DONE
// Refactorear todo
// localstorage not working properly, itemsarray still populated after clean

const key = 'XI708TfbCeY0K_16jtVdx-sbW4nuRkKd1HUtXKBtn2g';

/// //////////////////////////////// Helper Functions /////////////////////////////////////

const parsePictures = parsedRes => {
  const { results } = parsedRes; // arr
  totalPages = parsedRes.total_pages;
  const minifiedResult = results.map(pictureObject => { // arr
    const { id } = pictureObject;
    const url = pictureObject.urls.small;
    const { likes } = pictureObject;

    return {
      id,
      url,
      likes,
    };
  });
  return minifiedResult;
};

const appendPictures = arr => {
  arr.forEach(imageObject => {
    const imgElement = document.createElement('img');
    imgElement.setAttribute('src', imageObject.url);
    wrapper.appendChild(imgElement);
  });
};

const cleaner = element => {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

const disablePrevAndNext = () => {
  prev.style.display = 'block';
  next.style.display = 'block';
  if (pageNumber === 1) {
    prev.disabled = true;
  }

  if (pageNumber !== 1) {
    prev.disabled = false;
  }

  if (pageNumber === totalPages) {
    next.disabled = true;
  }
};

/// //////////////////////////////// Main Functions /////////////////////////////////////

const getPictures = async inputValue => {
  const theData = await fetch(`https://api.unsplash.com/search/photos?client_id=${key}&query=${inputValue}&page=${pageNumber}`)
    .then(res => res.json())
    .then(parsedRes => parsedRes);

  /*   const theData = await mock; */
  const minifiedResult = await parsePictures(theData);
  disablePrevAndNext();
  cleaner(wrapper);
  appendPictures(minifiedResult);
};

/// //////////////////////////////// Event Listeners /////////////////////////////////////

form.addEventListener('submit', e => {
  currentInput = input.value;
  getPictures(input.value);
  e.preventDefault();
  if (!itemsArray.includes(input.value.toLowerCase()) && input.value !== '') {
    itemsArray.push(input.value.toLowerCase());
  }

  localStorage.setItem('items', JSON.stringify(itemsArray));
  const content = document.getElementById('myDropdown');
  content.classList.remove('show');

  input.value = '';
  pageNumber = 1;
});

form.addEventListener('click', () => {
  const list = document.getElementById('dropdown-list');
  const content = document.getElementById('myDropdown');
  content.classList.add('show');

  cleaner(ul);

  JSON.parse(Object.values(localStorage)[1]).forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = item;
    list.appendChild(li);
  });
});

clearButton.addEventListener('click', () => {
  localStorage.clear();
  itemsArray = [];
});

prev.addEventListener('click', () => {
  pageNumber -= 1;
  getPictures(currentInput);
});

next.addEventListener('click', () => {
  pageNumber += 1;
  getPictures(currentInput);
});

window.onclick = event => {
  if (event.target.matches('li')) {
    input.value = event.target.innerText;
    currentInput = input.value;
    getPictures(input.value);
    const content = document.getElementById('myDropdown');
    content.classList.remove('show');
  }
  if (!event.target.matches('#search')) {
    const content = document.getElementById('myDropdown');
    content.classList.remove('show');
  }
};
