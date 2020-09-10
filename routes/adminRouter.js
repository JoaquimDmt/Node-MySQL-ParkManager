const express = require("express");
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const parkingController = require('../controllers/parkingController');

const router = express.Router();

router.get('/', authController.isLoggedIn, (req, res) => {
    res.redirect('/'); //pas de page pour l'url /admin alors redirection à la racine (index.hbs / accueil), évite d'arriver sur page erreur
});

// callback functions can be an array of middleware functions
router.get('/panel', [authController.isLoggedIn, parkingController.getPlaces, parkingController.getPlacesNumber, parkingController.getOccupiedPlacesNumber], (req, res) => {
    //double sécurité (le lien vers le panel admin est visible seulement pour les users ayant le role ADMIN mais pour accéder à la page ensuite il faut revérifier le role ADMIN, sinon une personne non-admin pourrait y accéder en trouvant l'url). Plus vérifier bien entendu que l'utilisateur est connecté avant tout.
    if(req.user && req.user.role==="ADMIN"){
            const availablePlacesNumber = req.placesNumber.count - req.takenPlacesNumber.count;
            const occupancyRate = (req.takenPlacesNumber.count*100)/req.placesNumber.count;
        
            res.render('admin/panel', {user: req.user, places: req.places, placesNumber: req.placesNumber.count, takenPlacesNumber: req.takenPlacesNumber.count, availablePlacesNumber: availablePlacesNumber, occupancyRate: occupancyRate});
    } else {
        console.log("Vous ne pouvez pas accéder à cette page car vous n'êtes pas connecté en tant qu'administrateur")
        res.redirect('/');
    }
});

//  -------------------------------------------------------------

router.post('/place/create', adminController.placeCreate);
//pas besoin de reverifier si admin ? methode post possible seulement depuis le formulaire ? (form disponible si on est déjà connecté sur la panel admin)

// router.get('/place/delete/:id', adminController.placeDelete); //no security, pas bon car possible de supprimer place de parking en changeant l'url sans vérifier si admin

//delete method not working
router.get('/place/delete/:id', authController.isLoggedIn, (req, res) => {
    if(req.user && req.user.role==="ADMIN"){ //verfier si admin avant
        console.log("co")
        adminController.placeDelete(req, res); //si admin alors delete place
    } else {
        console.log("Vous n'avez pas la permission pour effectuer cette requête")
        res.redirect('/');
    }
});

module.exports = router;