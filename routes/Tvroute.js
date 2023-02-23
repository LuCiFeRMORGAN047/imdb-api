const {Router} = require('express')
const tvcon = require('../controllers/TvCon')
const router =Router()



router.get('/api/t/trend', tvcon.getTrendingTvShows);
router.get('/api/t/upcoming', tvcon.getUpcomingTv);


module.exports = router