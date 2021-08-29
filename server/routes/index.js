const auth = require('./auth.routes.js');
const file = require('./file.routes.js');
const user = require('./user.routes.js');

module.exports = {
    auth,
    file,
    user
}