const Router = require('express');
const {user: Controller} = require('../controllers');
const {check} = require('express-validator');
const authMiddleware = require('../middleware/auth.middleware');

const router = Router();

// /api/user 'POST'
router.post('/avatar', authMiddleware, Controller.avatar);
router.post('/username', [
    authMiddleware,
    check('username', 'Username length: min is 3, max is 20').isLength({min: 3, max: 20})
], Controller.username);
router.post('/email', [
    authMiddleware,
    check('email', 'Incorrect email').isEmail()
], Controller.email);

// /api/user 'DELETE'
router.delete('/clean', authMiddleware, Controller.clean)

module.exports = router;