const express = require("express");
const profileController = require("../controllers/profileController");

const router = express.Router();

router.post('/update-email', profileController.updateEmail); //put method ? not working with form

router.post('/update-name', profileController.updateName); //put method ? not working with form

router.get('/delete/confirmation', profileController.deleteConfirmation); //page intermédiaire : utilisateur confirme qu'il veut supprimer son compte

router.get('/delete/:id', profileController.delete); //delete method ? not working with form

//what is the best way to pass data depending context? :params, ?query or req.body ?? moi j'ai utiliser params pour recup id, query pour recup phrases/props, et req.body pour passer les données de l'utilisateur

module.exports = router;