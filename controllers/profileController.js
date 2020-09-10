const db = require("../config/db");
const alert = require('alert');

exports.updateEmail = async (req, res) => {
    // console.log(req.body); //data sent through profile email update form
    const {userId, newEmail, currentEmail} = req.body;

    db.query('UPDATE users SET email = ? WHERE id = ?', [newEmail, userId], async (error, results) => {
        if(error){
            console.log(error);
        } else if(newEmail===currentEmail) {
            console.log("it's the same email adress as before")
            return res.redirect("/profile?message=L'adresse email est la même que précedemment&message_color=alert-secondary")
        } else {
            console.log("email update successful")
            return res.redirect("/profile?message=Changement d\'adresse email effectué ✓&message_color=alert-success")
        }
    });
}

exports.updateName = async (req, res) => {

    const {userId, newName, currentName} = req.body;

    db.query('UPDATE users SET nom = ? WHERE id = ?', [newName, userId], async (error, results) => {
        if(error){
            console.log(error);
        } else {
            console.log("Nom modifé : ",currentName," -> ",newName);
            return res.redirect("/profile");
        }
    });
}

exports.deleteConfirmation = async (req, res) => {
    return res.redirect("/profile?deleteConfirmation=Voulez-vous vraiment supprimer votre compte ?");
    // return res.render('profile', {
    //     deleteConfirmation: 'Voulez-vous vraiment supprimer votre compte ?'
    // }); //redirect because render do not display data from other controllers
}

exports.delete = async (req, res) => {
    // console.log(req.params.id); //id sent in url params
    const userId = req.params.id;

    db.query('DELETE FROM users WHERE id = ?', [userId], async (error, results) => {
        if(error){
            console.log(error);
        } else {
            console.log(results, "delete successful");
            alert('Compte supprimé')
            return res.redirect("/");
        }
    });
}