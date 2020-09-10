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
exports.isOccupied = (places, res) => {

    db.query('SELECT * FROM occupe', (error, results) => {
        if(error){
            console.log(error);
        } else {
            
            occupiedPlaces = results.map(item => item.id_parking_place);
            console.log("PLACES OCCUPEES",occupiedPlaces);
        
            console.log("LISTE TOTALE PLACES", places);
            const placesData = places.map( place => {
                if(occupiedPlaces.includes(place.id) == true){
                    // console.log("Place Occupée :",place);
                    return place.taken = true;
                } else {
                    // console.log("Place Libre :", place)
                    return place.taken = false;
                }
            }
                
            );
            // console.log("ANCIEN TABLEAU DES PLACES", places);
            console.log("NOUVEAU TABLEAU DES PLACES",placesData)
            //apparemment pas besoin d'envoyer un nouveau tableau combinant les données de places plus la valeur taken ?? pk ça marche déjà là ?
        }
    })
}

//obtenir la lsite des places occupées par un utilisateur
exports.getUserPlaces = async (req, res, next) => {
    
    try{
        db.query('SELECT * FROM occupe WHERE id_user = ?', [req.user.id], (error, results) => {
            if(error){
                console.log(error);
            } else {
                if(!results){
                    return next();
                }
                req.userPlaces = results;
                // console.log(req.userPlaces,"userPlaces")
                return next();
            }
        })
    } catch (error){
        console.log(error);
        return next();
    }
}

// assigner place à l'utilisateur
exports.reserve = (req, res) => {

    const userId = req.query.userId;
    const placeId = req.query.placeId;
    const etage = req.query.etage;//etage doit normalement pas être recup dans la table occupe mais dans la table parking_places, mais raccourci car j'ai pas encore trouver comment afficher à la fois les données des deux tables dans la liste "où je suis garé"

    //!rajouter test si id de la place existe ou si il elle est déja réservée pour éviter bug requete ou attribution place déja prise
 
    try{
        db.query('INSERT INTO occupe (id_parking_place, id_user, etage_temporary) VALUES (?,?,?)', [placeId, userId, etage], (err, results) => {
            if(err){
                console.log(err);
            } else {
                if(!results){
                    // return res.redirect("/parking");
                }
                return res.redirect("/parking");
            }
        })
    } catch {
        console.log(error);
    }
}

// dé-assigner place à l'utilisateur
exports.remove = (req, res) => {

    const userId = req.query.userId;
    const placeId = req.query.placeId;

    //!rajouter test si id de la place existe et si il elle est bien réservée par nous pour éviter bug requete ou dé-assigner place qui n'est pas assignée à nous
 
    try{
        db.query('DELETE FROM occupe WHERE id_parking_place = ? AND id_user = ?', [placeId, userId], (err, results) => {
            if(err){
                console.log(err);
            } else {
                if(!results){
                    // return res.redirect("/parking");
                }
                return res.redirect("/parking/me");
            }
        })
    } catch {
        console.log(error);
    }
}