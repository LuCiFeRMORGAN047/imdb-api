const { URLSearchParams } = require('url');
const fetch = require('minipass-fetch');



async function searchMulti(query) {
  const params = new URLSearchParams({
    query: query,
    api_key: process.env.TMDB_API_KEY,
  });
  const url = `https://api.themoviedb.org/3/search/multi?${params}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  const searchResults = await Promise.all(data.results.map(async (result) => {
    const externalIdsUrl = `https://api.themoviedb.org/3/${result.media_type}/${result.id}/external_ids?api_key=${process.env.TMDB_API_KEY}`;
    const externalIdsResponse = await fetch(externalIdsUrl);
    const externalIdsData = await externalIdsResponse.json();
    const imdbId = externalIdsData.imdb_id;

    return {
      id: result.id,
      title: result.title || result.name,
      overview: result.overview,
      poster: `https://image.tmdb.org/t/p/w500${result.poster_path}`,
      media_type: result.media_type,
      imdb_id: imdbId,
    };
  }));

  return searchResults;
}

module.exports.Search = async (req, res) => {
  const query = req.query.q;
  if (!query) {
    res.status(400).send('Missing search query parameter');
    return;
  }

  try {
    const results = await searchMulti(query);
    res.send(results);
  } catch (error) {
    res.status(500).send('Error searching for query');
  }
};