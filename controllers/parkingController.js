const db = require("../config/db");

exports.getPlaces = async (req, res, next) => {
    try{

        db.query('SELECT * FROM parking_places', (error, results) => {
            if(error){
                console.log(error);
            } else {
                if(!results){
                    return next();
                }
                // console.log(results);
                req.places = results;
                return next();
            }
        })

    } catch (error){
        console.log(error);
        return next();
    }
}