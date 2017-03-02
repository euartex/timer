var express = require('express');
var router = express.Router();
var game = require('../controllers/game');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index',
        {
            title: 'Fake Gambling - Crash',
            'DefaultCash': parseFloat(game.balance).toFixed(2),
            'CurrencyName': '\$'
        }
    );
});

module.exports = router;
