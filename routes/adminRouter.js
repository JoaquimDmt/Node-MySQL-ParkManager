const express = require("express");
const authController = require('../controllers/authController')
const adminController = require('../controllers/adminController')

const router = express.Router();

router.get('/', authController.isLoggedIn, (req, res) => {
    res.redirect('/'); //pas de page pour l'url /admin alors redirection à la racine (index.hbs / accueil), évite d'arriver sur page erreur
});

// callback functions can be an array of middleware functions
router.get('/panel', [authController.isLoggedIn, adminController.getPlaces], (req, res) => {
    //double sécurité (le lien vers le panel admin est visible seulement pour les users ayant le role ADMIN mais pour accéder à la page ensuite il faut revérifier le role ADMIN, sinon une personne non-admin pourrait y accéder en trouvant l'url). Plus vérifier bien entendu que l'utilisateur est connecté avant tout.
    if(req.user && req.user.role==="ADMIN"){
            res.render('admin/panel', {user: req.user, places: req.places});
    } else {
        console.log("Vous ne pouvez pas accéder à cette page car vous n'êtes pas connecté en tant qu'administrateur")
        res.redirect('/');
    }
});

//  -------------------------------------------------------------

router.post('/place/create', adminController.placeCreate);

router.get('/place/delete/:id', adminController.placeDelete); //delete method


module.exports = router;