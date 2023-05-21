import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries.js';
import './css/styles.css';

const searchBox = document.getElementById('search-box');
const countriesList = document.getElementById('countries-list');
const countryInfo = document.getElementById('country-info');

const clearCountriesList = () => {
  countriesList.innerHTML = '';
};

const clearCountryInfo = () => {
  countryInfo.innerHTML = '';
};

const showCountriesList = countries => {
  if (countries.length > 10) {
    Notiflix.Notify.warning(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }

  const countriesHTML = countries
    .map(
      country =>
        `<li><img src="${country.flags.svg}" alt="${country.name}">${country.name}</li>`
    )
    .join('');

  countriesList.innerHTML = `<ul>${countriesHTML}</ul>`;
};

const showCountryInfo = country => {
  const languages = country.languages.map(lang => lang.name).join(', ');
  const countryHTML = `
    <div class="country-card">
      <img class="country-flag" src="${country.flags.svg}" alt="${country.name}">
      <h2 class="country-name">${country.name}</h2>
      <p><span class="country-info-label">Capital:</span> ${country.capital}</p>
      <p><span class="country-info-label">Population:</span> ${country.population}</p>
      <p><span class="country-info-label">Languages:</span> ${languages}</p>
    </div>
  `;

  countryInfo.innerHTML = countryHTML;
};

const handleSearch = debounce(async () => {
  const searchTerm = searchBox.value.trim();

  if (searchTerm === '') {
    clearCountriesList();
    clearCountryInfo();
    return;
  }

  try {
    const countries = await fetchCountries(searchTerm);

    if (countries.length === 1) {
      showCountryInfo(countries[0]);
      clearCountriesList();
    } else {
      if (countries.length > 10) {
        Notiflix.Notify.warning(
          'Too many matches found. Please enter a more specific name.'
        );
        clearCountryInfo();
        return;
      }

      showCountriesList(countries);
      clearCountryInfo();
    }
  } catch (error) {
    Notiflix.Notify.failure('Oops, there is no country with that name.');
  }
}, 300);

searchBox.addEventListener('input', handleSearch);
