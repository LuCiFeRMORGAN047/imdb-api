module.exports.getTrendingTvShows = async (req, res) => {
  const params = new URLSearchParams({
    api_key: process.env.TMDB_API_KEY,
    language: 'en-US',
    time_window: 'day'
  });

  try {
    const BASE_URL = 'https://api.themoviedb.org/3';
    const response = await fetch(`${BASE_URL}/trending/tv/day?${params}`);
    const data = await response.json();
    const tvShows = data.results.map(async tvShow => {
      const externalIdsResponse = await fetch(`${BASE_URL}/tv/${tvShow.id}/external_ids?api_key=${process.env.TMDB_API_KEY}`);
      const externalIdsData = await externalIdsResponse.json();
      return {
        imdb_id: externalIdsData.imdb_id,
        title: tvShow.name,
        rating: tvShow.vote_average,
        poster: `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`
      };
    });
    const tvShowsWithIds = await Promise.all(tvShows);
    res.json(tvShowsWithIds);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving trending TV shows');
  }
}
  module.exports.getUpcomingTv = async (req, res) => {
    const apiUrl = `https://api.themoviedb.org/3/tv/on_the_air?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`;
    const posterBaseUrl = 'https://image.tmdb.org/t/p/w500';
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const upcomingTvShows = data.results.map(tvShow => {
        return {
          imdb_id: tvShow.id,
          title: tvShow.name,
          poster: `${posterBaseUrl}${tvShow.poster_path}`,
          overview: tvShow.overview,
          release_date: tvShow.first_air_date
        };
      });
      res.json(upcomingTvShows);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving upcoming TV shows');
    }
  }