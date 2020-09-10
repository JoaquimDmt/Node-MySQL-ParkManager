const db = require("../config/db");

// obtenir toutes les places de parking
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

// obtenir les places de parking se trouvant à l'étage demandé
exports.getPlacesByFloor = async (req, res, next) => {
    try{

        db.query('SELECT * FROM parking_places WHERE etage = ?', [etage],(error, results) => {
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

//obtenir le nombre total de places dans le parking
exports.getPlacesNumber = (req, res, next) => {
    try{

        db.query('SELECT COUNT(*) AS count FROM parking_places', (error, results) => {
            if(error){
                console.log(error);
            } else {
                if(!results){
                    return next();
                }
                // console.log(results);
                //// req.placesNumber = JSON.stringify(results[0]); //PAS BON
                req.placesNumber = results[0];
                // console.log(req.placesNumber);
                return next();
            }
        })

    } catch (error){
        console.log(error);
        return next();
    }
}

//obtenir le nombre de places occupées dans le parking (et indirectement le nombre de places libres : total - occupées)
exports.getOccupiedPlacesNumber = (req, res, next) => {
    try{

        db.query('SELECT COUNT(*) AS count FROM occupe', (error, results) => {
            if(error){
                console.log(error);
            } else {
                if(!results){
                    return next();
                }
                req.takenPlacesNumber = results[0];
                return next();
            }
        })

    } catch (error){
        console.log(error);
        return next();
    }
}

//obtenir la liste des places occupées (id des places occupées ainsi que les infos sur ces occupations : qui possède la place, depuis quand)
exports.isOccupied = async (req, res, next) => {
    try{

        db.query('SELECT * FROM occupe', (error, results) => {
            if(error){
                console.log(error);
            } else {
                if(!results){
                    return next();
                }
                console.log(results);
                // req.places = results.map(item => item.id_parking_place);
                req.places = results.map(item => item);
                console.log(req.places);
                return next();
            }
        })

    } catch (error){
        console.log(error);
        return next();
    }
}

//obtenir la lsite des places occupées par un utilisateur
exports.getUserPlaces = async (req, res, next) => {
    try{

        db.query('SELECT * FROM occupe WHERE id = ?', [userId], (error, results) => {
            if(error){
                console.log(error);
            } else {
                if(!results){
                    return next();
                }
                console.log(results);
                req.places = results.map(item => item.id_parking_place);
                console.log(req.places);
                return next();
            }
        })

    } catch (error){
        console.log(error);
        return next();
    }
}