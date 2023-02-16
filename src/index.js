import axios from 'axios';
import { alert } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import numeral from 'numeral';

import './styles/index.scss';
import photoCardTemplate from './partials/photoCard.hbs';

// Vars

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
  body: document.querySelector('body'),
  modal: document.querySelector('.modal'),
  scrollBtn: document.querySelector('.scroll-btn'),
};

let page = 1;
let query = '';
let perPage = 12;
let photoCards;
let modalImage = '';

// Functions

function findPhotos() {
  photoCards = document.querySelectorAll('.photo-card');

  photoCards.forEach((photoCard) => {
    photoCard.addEventListener('click', (e) => {
      if (!e.target.dataset.url) {
        return;
      }

      modalImage = refs.modal.firstElementChild;
      modalImage.src = e.target.dataset.url;
      refs.modal.classList.add('active');
      refs.body.classList.add('fixed');
      refs.scrollBtn.classList.remove('active');
    });
  });

  refs.modal.addEventListener('click', (e) => {
    if (!e.target.classList.contains('modal__img') && refs.modal.classList.contains('active')) {
      refs.modal.classList.remove('active');
      refs.body.classList.remove('fixed');
      refs.scrollBtn.classList.add('active');

      modalImage.src = '';
      modalImage = '';
    }
  });
}

function fetchRequest() {
  if (page > 1) {
    refs.loadMoreBtn.textContent = 'Loading...';
    refs.loader.style.display = 'none';
  } else {
    refs.loadMoreBtn.style.display = 'none';
    refs.loader.style.display = 'block';
  }

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
      refs.loadMoreBtn.textContent = 'Load more';

      if (res.data.hits.length === 0) {
        alert({
          text: 'Нічого не знайдено',
        });
        refs.loadMoreBtn.style.display = 'none';

        return;
      }

      console.log(res.data);

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
        refs.loadMoreBtn.disabled = false;
      }

      findPhotos();
    })
    .catch((error) => {
      alert({
        title: 'Невідома помилка',
      });

      refs.loadMoreBtn.style.display = 'none';
    })
    .finally(() => {
      refs.loader.style.display = 'none';
    });
}

// Events listeners

refs.searchForm.addEventListener('submit', (e) => {
  e.preventDefault();

  query = e.target.elements.query.value.trim();

  if (query === '') {
    alert({
      text: 'Введіть пошуковий запит',
    });
    return;
  }

  if (query.length >= 100) {
    alert({
      text: 'Запит повинен містити не більше 100 символів',
    });
    return;
  }

  refs.gallery.innerHTML = '';
  page = 1;

  fetchRequest();
});

refs.loadMoreBtn.addEventListener('click', (e) => {
  refs.loadMoreBtn.disabled = true;
  fetchRequest();
  console.log(true);
});

window.addEventListener('scroll', (e) => {
  if (window.scrollY > 400) {
    refs.scrollBtn.classList.add('active');
  } else {
    refs.scrollBtn.classList.remove('active');
  }
});

refs.scrollBtn.addEventListener('click', (e) => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});
