import SearchImagesApi from './search-api';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchImagesApi = new SearchImagesApi();

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  toTopBtn: document.querySelector('.to-top'),
}

// console.log(refs.toTopBtn);

refs.form.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
window.addEventListener('scroll', () => {
  if (window.pageYOffset > 100) {
    refs.toTopBtn.classList.add('active');
  } else {
    refs.toTopBtn.classList.remove('active');
  }
})
refs.toTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
})

async function onSearch(event) {
  event.preventDefault();
  searchImagesApi.query = event.target.elements.searchQuery.value;
  searchImagesApi.page = 1;
  refs.loadMoreBtn.style.display = 'none';
  
  try {
    const response = await searchImagesApi.fetchImages();
    searchImagesApi.page += 1;

    if (response.data.hits.length < 1 || event.target.elements.searchQuery.value === '') {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.', {
          position: 'center-top',
          distance: '80px',
          clickToClose: true,
          failure: {background: '#ff7f50'},
        });
      refs.gallery.innerHTML = '';
    } else {
      const createGallery = response.data.hits.map(renderPhotoCard).join('');
      refs.gallery.innerHTML = createGallery;

      const lightbox = new SimpleLightbox('.gallery div a', {
        overlay: true,
        overlayOpacity: 0.8,
      });

      refs.loadMoreBtn.style.display = 'block';
      Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`, {
          distance: '80px',
          timeout: 2000,
      });
    }

    if (refs.gallery.childElementCount === response.data.totalHits) {
      refs.loadMoreBtn.style.display = 'none';
    } 
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMore() {
  refs.loadMoreBtn.style.display = 'block';

  try {
    const response = await searchImagesApi.fetchImages();
    searchImagesApi.page += 1;
    const createGallery = response.data.hits.map(renderPhotoCard).join('');
    refs.gallery.insertAdjacentHTML('beforeend', createGallery);

    const lightbox = new SimpleLightbox('.gallery div a', {
      overlay: true,
      overlayOpacity: 0.8,
    });

    lightbox.refresh();

    const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 4 + 100,
      behavior: "smooth",
    });

    if (refs.gallery.childElementCount === response.data.totalHits) {
      Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.", {
        position: 'center-bottom',
        distance: '80px',
        failure: {background: '#ff7f50'},
      });
      refs.loadMoreBtn.style.display = 'none';
    }   
  } catch (error) {
    console.log(error);
  }
}

function renderPhotoCard({largeImageURL, webformatURL, tags, likes, views, comments, downloads}) {
  return `<div class="photo-card">
    <a class="photo-card__link" href="${largeImageURL}">
      <img class="photo-card__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b> ${likes}
      </p>
      <p class="info-item">
        <b>Views</b> ${views}
      </p>
      <p class="info-item">
        <b>Comments</b> ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b> ${downloads}
      </p>
    </div>
  </div>`
}



