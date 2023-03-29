import axios from 'axios';
// const BASE_URL = 'https://pixabay.com/api/';
// const API_KEY = '34813361-3927ac478a2bf3f204ffaaf5a';

export class createAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '34813361-3927ac478a2bf3f204ffaaf5a';

  search = null;
  step = 1;
  count = 40;

  async fetchCards() {
    try {
      const result = await axios.get(
        `${this.#BASE_URL}?key=${this.#API_KEY}&q=${
          this.search
        }&image_type=photo&orientation=horizontal&safesearch=true&per_page=${
          this.count
        }&page=${this.step}`
      );

      return result;
    } catch (error) {
      console.log(error);
    }
  }
}

// async function fetchCards(value) {
//   const respone = await fetch(
//     `https://pixabay.com/api/?key=34813361-3927ac478a2bf3f204ffaaf5a&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=4&page=1`
//   );
//   const cards = await respone.json();
//   return cards;
// }
