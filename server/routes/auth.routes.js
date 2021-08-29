const Router = require('express');
const {auth: Controller} = require('../controllers');
const {check} = require('express-validator');
const authMiddleware = require('../middleware/auth.middleware');

const router = Router();

// /api/auth 'POST'
router.post('/registration',[
    check('email', 'Incorrect email').isEmail(),
    check('password', 'Password symbols length: min is 6, max is 25').isLength({min: 6, max: 25})
], Controller.registration);
router.post('/login', Controller.login);

// /api/auth 'GET'
router.get('/', authMiddleware, Controller.auth);

module.exports = router;