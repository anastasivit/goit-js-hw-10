export const fetchCountries = async name => {
  const response = await fetch(
    `https://restcountries.com/v2/name/${name}?fields=name,flags,capital,population,languages`
  );

  if (!response.ok) {
    throw new Error('Unable to fetch countries.');
  }

  const data = await response.json();
  return data;
};
