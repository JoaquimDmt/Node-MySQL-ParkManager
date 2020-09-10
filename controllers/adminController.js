// const AdminModel = require("../models/adminModel")

// exports.placeCreate = (req, res) => {
//     AdminModel.placeCreate(req.body, function(err) {
//         if(err){
//             console.log(err);
//         }
//         console.log("ok", req.body);
//         res.redirect("admin/panel");
//     })
// }

const db = require("../config/db");

exports.placeCreate = (req, res) => {
    // console.log("ok", req.body);
    db.query('INSERT INTO parking_places (etage) VALUES (?)', [req.body.etage], (err, results) => {
            if(err){
                console.log(err);
            } else {
                // console.log("create place results", results);
                return res.redirect("/admin/panel");
            }
        }
    )
}

exports.placeDelete = (req, res) => {
    
    const placeId = req.params.id;

    db.query('DELETE FROM parking_places WHERE id = ?', [placeId], (err, results) => {
        if(err){
            console.log(err);
        } else {
            console.log("delete place", placeId, "results", results);

            // Si il y les dernières places 22, 23, 24 ont été supprimées, éviter de créer 25 mais plutôt 22. 
            db.query('ALTER TABLE parking_places AUTO_INCREMENT = 1');

            return res.redirect("/admin/panel");
        }
    }
)}