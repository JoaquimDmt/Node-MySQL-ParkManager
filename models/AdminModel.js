// const db = require("../config/db");

// exports.placeCreate = (req, callback) => {
//     // console.log("req.etage",req.etage);
//     db.query(
//         'INSERT INTO parking_places (etage) VALUES (?)', [req.etage], (err, results) => {
//             if(err){
//                 console.log(err);
//             } else {
//                 console.log("create place results", results);
//             }
//         }, callback
//     )
// }

// exports.placeDelete = (req, res) => {

// }