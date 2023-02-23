const axios = require('axios')
module.exports.getTopRatedMovies = async (req, res) => {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.TMDB_API_KEY}`);
    const movies = await Promise.all(
      response.data.results.map(async (movie) => {
        const movieDetails = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=external_ids`);
        return {
          id: movie.id,
          imdb_id: movieDetails.data.external_ids.imdb_id,
          title: movie.title,
          rating: movie.vote_average,
          poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        };
      })
    );
    res.send(movies);
  } catch (error) {
    console.error(error);
  }
};

module.exports.searchById = async (req, res) => {
  const id = req.params.id;
  const apiUrl = `https://api.themoviedb.org/3/find/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US&external_source=imdb_id`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    let result;
    if (data.movie_results.length > 0) {
      result = data.movie_results[0];
      result.media_type = "movie";
    } else if (data.tv_results.length > 0) {
      result = data.tv_results[0];
      result.media_type = "tv";
    } else {
      res.status(404).send("No results found");
      return;
    }

    // Get the genres for the movie or TV show
    const genreResponse = await fetch(`https://api.themoviedb.org/3/${result.media_type}/${result.id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`);
    const genreData = await genreResponse.json();
    result.genres = genreData.genres;

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error searching by ID");
  }
};
  module.exports.getTrendingMovies = async (req, res) => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.TMDB_API_KEY}`);
      const movies = response.data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        release_date: movie.release_date,
        poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        overview: movie.overview,
        vote_average: movie.vote_average,
        imdb_id: movie.imdb_id
      }));
      res.send(movies)
    } catch (error) {
      console.error(error);
    }
  }
  module.exports.getUpcomingMovies = async (req, res) => {
    const apiUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`;
    
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const movies = await Promise.all(data.results.map(async movie => {
        const imdbResponse = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/external_ids?api_key=${process.env.TMDB_API_KEY}`);
        const imdbData = await imdbResponse.json();
        return {
          id: movie.id,
          title: movie.title,
          release_date: movie.release_date,
          poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          imdb_id: imdbData.imdb_id
        };
      }));
      res.json(movies);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving upcoming movies');
    }
  };
  
  
  
  
  
  