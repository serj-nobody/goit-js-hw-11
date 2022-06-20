const axios = require('axios').default;

export default class SearchImagesApi {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchImages() {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '28115905-2ab66f444fd8f372634da0160';

  return axios.get(`${BASE_URL}`, {
    params: {
      key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: 40,

    }});
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}