import './styles/index.scss';
import axios from 'axios';
import { alert } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

import photoCardTemplate from './partials/photoCard.hbs';
import { entries } from 'lodash';

const fetch = {
  apiToken: '33665756-797053471af2a43772fb226e5',
  apiLink:
    'https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=что_искать&page=номер_страницы&per_page=12&key=твой_ключ',
};

const refs = {
  gallery: document.querySelector('.gallery'),
  searchForm: document.querySelector('#search-form'),
  loadMoreBtn: document.querySelector('#loadMoreBtn'),
  loader: document.querySelector('.loader'),
};

let page = 1;
let query = '';
let perPage = 12;

// Functions

function fetchRequest() {
  refs.loader.style.display = 'block';
  refs.loadMoreBtn.style.display = 'none';

  axios
    .get(`https://pixabay.com/api`, {
      params: {
        q: query,
        page,
        per_page: perPage,
        key: fetch.apiToken,
        image_type: 'photo',
        orientation: 'horizontal',
      },
    })
    .then((res) => {
      if (res.data.hits.length === 0) {
        alert({
          text: 'Нічого не знайдено',
        });
        return;
      }

      page++;
      let html = '';

      res.data.hits.forEach((hit) => {
        const hitHtml = photoCardTemplate(hit);
        html += hitHtml;
      });

      refs.gallery.insertAdjacentHTML('beforeend', html);

      if (res.data.hits.length < perPage) {
        refs.loadMoreBtn.style.display = 'none';
      } else {
        refs.loadMoreBtn.style.display = 'block';
      }

      console.log(res.data.hits.length);
    })
    .catch((error) => {})
    .finally(() => {
      refs.loader.style.display = 'none';
    });
}

// Events listeners

refs.searchForm.addEventListener('submit', (e) => {
  e.preventDefault();

  query = e.target.elements.query.value;

  if (query === '') {
    alert({
      text: 'Введіть пошуковий запит',
    });
    return;
  }

  refs.gallery.innerHTML = '';
  page = 1;

  fetchRequest();
});

refs.loadMoreBtn.addEventListener('click', (e) => {
  fetchRequest();
});
