const express = require("express");
const authController = require("../controllers/authController");
const parkingController = require("../controllers/parkingController");

const router = express.Router();

router.get('/', [authController.isLoggedIn, parkingController.getPlaces, parkingController.getPlacesNumber, parkingController.getOccupiedPlacesNumber], (req, res) => {
    // res.send("<h1>Home Page</h1>")
    const availablePlacesNumber = req.placesNumber.count - req.takenPlacesNumber.count;
    // console.log(req.places)//on recup liste des places

    parkingController.isOccupied(req.places);//on va tester chaque place et renvoyer un nouveau tableau avec en plus la valeur taken= true ou false;
    
    //pas totalement compris comment j'ai fait fonctionné isOccupied : je n'ai même pas envoyer en resultat mon tableau takenOrNot avec les valeurs taken ; et comment dans parking.hbs il a correctement associer la valeur taken avec places sans être dans le même tableau
    if(req.user){
        res.render('parking', {user: req.user, places: req.places, placesNumber: req.placesNumber.count, availablePlacesNumber: availablePlacesNumber});
    } else {
        console.log("Vous n'avez pas la permission pour effectuer cette requête")
        res.redirect('/');
    }
});

router.get('/reserve/', authController.isLoggedIn, (req, res) => {
    // empecher url attack menant à reserver : sans etre connecté / pour un autre user
    if(req.user && req.user.id == req.query.userId){
        parkingController.reserve(req, res);
    } else {
        console.log('Alors comme ça on tente de percer ma sécurité ? Vous ne passerez pas !');
        res.redirect('/');
        //redirige vers l'accueil si la personne n'est pas connectée ou si il tente une attaque dans l'url
    }
});

router.get('/me', [authController.isLoggedIn, parkingController.getUserPlaces], (req, res) => {
    // console.log(req.userPlaces,"userPlaces");
    res.render('userParking', {userPlaces: req.userPlaces});
});

router.get('/me/remove', authController.isLoggedIn, (req, res) => {
    // empecher url attack menant à dé-assigner un place sans etre connecté ou pour un autre utilisateur
    console.log(req.query)
    if(req.user && req.user.id == req.query.userId){
        parkingController.remove(req, res);
    } else {
        console.log('Alors comme ça on tente de percer ma sécurité ? Vous ne passerez pas !');
        res.redirect('/');
        //redirige vers l'accueil si la personne n'est pas connectée ou si il tente une attaque dans l'url
    }
});

module.exports = router;