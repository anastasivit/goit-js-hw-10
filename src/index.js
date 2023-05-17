import './css/styles.css';

const DEBOUNCE_DELAY = 300;
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const searchBox = document.getElementById('search-box');
const countriesList = document.getElementById('countries-list');
const countryInfo = document.getElementById('country-info');

const fetchCountries = async name => {
  const response = await fetch(
    `https://restcountries.com/v2/name/${name}?fields=name,flags,capital,population,languages`
  );

  if (!response.ok) {
    throw new Error('Unable to fetch countries.');
  }

  const data = await response.json();
  return data;
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
        `<li><img src="${country.flags.svg}" alt="${country.name.official}">${country.name.official}</li>`
    )
    .join('');

  countriesList.innerHTML = `<ul>${countriesHTML}</ul>`;
};

const showCountryInfo = country => {
  const languages = country.languages.map(lang => lang.name).join(', ');
  const countryHTML = `
    <div class="country-card">
      <img class="country-flag" src="${country.flags.svg}" alt="${country.name.official}">
      <h2 class="country-name">${country.name.official}</h2>
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
    countriesList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }

  try {
    const countries = await fetchCountries(searchTerm);

    if (countries.length === 1) {
      showCountryInfo(countries[0]);
      countriesList.innerHTML = '';
    } else {
      showCountriesList(countries);
      countryInfo.innerHTML = '';
    }
  } catch (error) {
    Notiflix.Notify.failure('Oops, there is no country with that name.');
  }
}, 300);

searchBox.addEventListener('input', handleSearch);
