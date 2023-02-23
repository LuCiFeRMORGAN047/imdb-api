const {Router} = require('express')
const MovieCon = require('../controllers/MovieCon')
const router =Router()


router.get('/api/get-top-rated-movies',MovieCon.getTopRatedMovies)
router.get('/api/title/:id',MovieCon.searchById)
router.get('/api/m/trend',MovieCon.getTrendingMovies)
router.get('/api/m/upcoming', MovieCon.getUpcomingMovies);
module.exports = router