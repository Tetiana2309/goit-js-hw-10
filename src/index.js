import Notiflix from 'notiflix';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import { fetchBreeds, fetchCatByBreed } from './cat-api.js';

const breedSelect = document.querySelector('select');
const catInfo = document.querySelector('.cat-info');

breedSelect.addEventListener('change', onSelectChange);

Notiflix.Loading.dots('Loading data, please wait...');

fetchBreeds()
  .then(breeds => {
    Notiflix.Loading.remove();
    breedSelect.classList.remove('is-hidden');
    breedSelectMarkup(breeds);
    new SlimSelect({
      select: breedSelect,
    });
  })
  .catch(error => {
    onFetchError(error);
    Notiflix.Loading.remove();
  });

function breedSelectMarkup(breeds) {
  breedSelect.innerHTML = breeds
    .map(breed => `<option value="${breed.value}">${breed.name}</option>`)
    .join('');
}

function onSelectChange(e) {
  Notiflix.Loading.dots('Loading data, please wait...');
  const breedId = e.currentTarget.value;
  fetchCatByBreed(breedId)
    .then(cat => {
      renderCatCard(cat);
      Notiflix.Loading.remove();
      catInfo.classList.remove('is-hidden');
    })
    .catch(error => {
      onFetchError(error);
      Notiflix.Loading.remove();
    });
}

function renderCatCard(cat) {
  catInfo.innerHTML = '';
  const html = `
              <img src="${cat.url}" alt="A cute cat">
              <div>
              <h2>${cat.breeds[0].name}</h2>
              <p>${cat.breeds[0].description}</p>
              <p><strong>Temperament:</strong> ${cat.breeds[0].temperament}</p>
              </div>
            `;
  catInfo.insertAdjacentHTML('beforeend', html);
}

function onFetchError(error) {
  Notiflix.Notify.failure(
    'Oops! Something went wrong! Try reloading the page!'
  );
}
