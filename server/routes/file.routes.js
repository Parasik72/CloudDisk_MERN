const Router = require('express');
const {file: Controller} = require('../controllers');
const authMiddleware = require('../middleware/auth.middleware');

const router = Router();

// /api/file 'POST'
router.post('/', authMiddleware, Controller.createDir);
router.post('/upload', authMiddleware, Controller.upload);

// /api/file 'GET'
router.get('/', authMiddleware, Controller.getFiles);
router.get('/download', authMiddleware, Controller.download);
router.get('/search', authMiddleware, Controller.search);

// /api/file 'DELETE'
router.delete('/', authMiddleware, Controller.delete);

// /api/file 'PATCH'
router.patch('/', authMiddleware, Controller.rename);

module.exports = router;