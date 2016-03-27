var userCtrl = require('../controllers/user.ctrl');
var express = require('express'),
    router = express.Router();

router.post('/token', userCtrl.getToken);

module.exports = router;