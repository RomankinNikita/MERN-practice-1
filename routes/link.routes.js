const {Router} = require('express');
const router = Router();
const authMiddleware = require('../middleware/auth.middleware');
const {generateLink, getLinks, getLink} = require('../controllers/link.controller');

// POST api/link/generate
router.post('/generate', authMiddleware, generateLink);

// GET api/link/
router.get('/', authMiddleware, getLinks);

// GET api/link/:id
router.get('/:id', authMiddleware, getLink);


module.exports = router;