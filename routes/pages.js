const express = require("express");
const authController = require('../controllers/authController');
const parkingController = require('../controllers/parkingController');

const router = express.Router();

router.get('/', [authController.isLoggedIn, parkingController.getPlaces, parkingController.getPlacesNumber, parkingController.getOccupiedPlacesNumber], (req, res) => {
    // res.send("<h1>Home Page</h1>")
    const availablePlacesNumber = req.placesNumber.count - req.takenPlacesNumber.count;
    
    res.render('index', {user: req.user, places: req.places, placesNumber: req.placesNumber.count, availablePlacesNumber: availablePlacesNumber});//pour afficher différement la page index si l'utilisateur est connecté (cf. views/index.hbs)
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

// pour acceder à cette page il faut être connecté : verifier qu'il y est un token et verifier que ce token corresponde à l'utilisateur
router.get('/profile', authController.isLoggedIn, (req, res) => {
    // console.log(req.query);
    //isLoggedIn renvoi req.user et ses données uniquement si connecté
    if(req.user){
        if(req.query.message){
            res.render('profile', {user: req.user, message: req.query.message, message_color: req.query.message_color});
        } else if(req.query.deleteConfirmation){
            res.render('profile', {user: req.user, deleteConfirmation: req.query.deleteConfirmation});
        } else {
            res.render('profile', {user: req.user});
        }
    } else {
        res.redirect('/login')
    }
    //si quelqu'un essaye d'accéder à la page profile et qu'il est connecté c'est bon sinon ramener à la page login (page visible uniquement pour les personnes ayant un compte et étant connectées)
});

module.exports = router;