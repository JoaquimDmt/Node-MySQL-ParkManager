const express = require("express");
const authController = require('../controllers/authController')

const router = express.Router();

router.get('/', authController.isLoggedIn, (req, res) => {
    // res.send("<h1>Home Page</h1>")
    res.render('index', {user: req.user});
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/profile', authController.isLoggedIn, (req, res) => {
    // console.log(req.message);
    if(req.user){
        res.render('profile', {user: req.user});
    } else {
        res.redirect('/login')
    }
    //si quelqu'un essaye d'accéder à la page profile et qu'il est connecté c'est bon sinon ramener à la page login (page visible uniquement pour les personnes ayant un compte et étant connectées)
});

module.exports = router;