import './css/styles.css';
import { createAPI } from './fetch';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const DEBOUNCE_DELAY = 300;

const form = document.querySelector('.search-form');
const input = document.querySelector('.input-value');
const list = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

const API = new createAPI();

btnLoadMore.addEventListener('click', loadMore);
form.addEventListener('submit', serchElement);

btnLoadMore.setAttribute('disabled', true);

function serchElement(event) {
  event.preventDefault();
  API.search = event.target.elements.searchQuery.value.trim();
  console.log(API.search);
  input.value = '';

  if (API.search !== '') {
    btnLoadMore.removeAttribute('disabled', false);
  }
  API.fetchCards(API.search)
    .then(data => {
      console.log(data.data.totalHits);
      if (data.data.total === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else if (data.data.total !== 0) {
        Notify.success(`Hooray! We found ${data.data.totalHits} images`);
      }
      render(data.data.hits);

      if (data.data.totalHits < 40) {
        Notify.success(
          `We're sorry, but you've reached the end of search results.`
        );
        btnLoadMore.setAttribute('disabled', true);
      }
    })
    .catch(err => console.log(err));
}

function render(elements) {
  list.innerHTML = tamplate(elements);
  galleryModal.refresh();
}

function loadMore() {
  API.step += 1;
  API.fetchCards()
    .then(data => {
      console.log(data.data);
      list.insertAdjacentHTML('beforeend', tamplate(data.data.hits));
      galleryModal.refresh();
    })
    .catch(err => {
      console.log(err);
    });
}

function tamplate(el) {
  const cards = el
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
        <a href="${largeImageURL}" ><img src="${webformatURL}" alt="${tags}" loading="lazy" width="300" height="200" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>`;
      }
    )
    .join('');

  return cards;
}

let galleryModal = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
