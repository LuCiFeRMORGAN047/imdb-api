const {Router} = require('express')
const SearchCon = require('../controllers/SearchCon')
const router =Router()


router.get('/api/search',SearchCon.Search)


module.exports = router