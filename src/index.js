import './css/styles.css';
import { createAPI } from './fetch';
import { Notify } from 'notiflix/build/notiflix-notify-aio';


const DEBOUNCE_DELAY = 300;

const form = document.querySelector('.search-form');
const input = document.querySelector('.input-value');
const list = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

const API = new createAPI();

btnLoadMore.addEventListener('click', loadMore);
form.addEventListener('submit', serchElement);

btnLoadMore.setAttribute('disabled', true);

async function serchElement(event) {
  event.preventDefault();
  API.search = event.target.elements.searchQuery.value.trim();
  console.log(API.search);
 input.value = ''
   

  if (API.search !== '') {
    btnLoadMore.removeAttribute('disabled', false);
  }  
    API.fetchCards(API.search)
      .then(data => {
        console.log(data)
        if (data.data.total === 0) {
          Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        } else if (data.data.total !== 0) {
          Notify.success(`Hooray! We found ${data.data.totalHits} images`);
        } render(data.data.hits);
      })
      .catch(err => console.log(err));
  

}

function render(elements) {
  const cards = elements
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
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="300" height="200" />
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

  list.innerHTML = cards;
}

function loadMore() {
  API.step += 1
  API.fetchCards().then(data => {
      const cards = data.data.hits
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
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="300" height="200" />
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
    console.log(data)
    list.insertAdjacentHTML('beforeend', cards);
  }).catch((err) => {
    console.log(err)
  })
}
