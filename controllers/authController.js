const db = require("../config/db");
// const AuthModel = require("../models/AuthModel")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require('dotenv').config();
const { promisify } = require("util");

exports.register = (req, res) => {
    console.log(req.body); //data sent through register form

    const {name, email, password, passwordConfirm} = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if(error){
            console.log(error);
        }
        if (results.length > 0){
            return res.render('register', {
                message: 'Cette adresse email est déjà utilisée'
            })
        } else if(password !== passwordConfirm){
            return res.render('register', {
                message: 'Les mots de passe ne correspondent pas'
            });
        }

        try{
            const salt = await bcrypt.genSalt() //default 10, le salt fait en sorte que si deux users ont le même password ils n'aient pas le même hashedpassword.
            const hashedPassword = await bcrypt.hash(password, salt);
            console.log("salt:",salt);
            console.log("hashedPassword:",hashedPassword);

            db.query('INSERT INTO users SET ?', {nom: name, email: email, mdp: hashedPassword}, (error, results) => {
                if(error){
                    console.log(error);
                } else {
                    console.log(results);
                    return res.render('register', {
                        message: 'Votre compte a bien été créé'
                    });
                };
            })
        } catch {
            res.status(500).send();
        }

    });
}

exports.login = (req, res) => {
    try {
        console.log(req.body);
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).render('login', {
                message: 'Veuillez entrer vos identifiants'
            })
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async(error, results) => {
            if(error){
                console.log(error);
            }
            // console.log(results);
            //comparer le mdp entré avec le mdp encrypté dans la bdd
            if(!results || !(await bcrypt.compare(password, results[0].mdp))){
                res.status(401).render('login', {
                    message: 'Email ou mot de passe incorrect'
                })
            } else { //sinon ca veut dire que identifiants ok
                const id = results[0].id;
                // jwt.sign({id} = jwt.sign({id: id}
                const token = jwt.sign({id}, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                }); //créé un token avec l'identifiant du user
                
                console.log("The token is: " + token)

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                        //pour avoir la valeur en jours
                    ),
                    httpOnly: true
                    //httpOnly pour eviter les attaques du genre ssh, rend possible uniquement via browser / http
                }

                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect("/");
                //status 200 tout va bien
            }
        })

    } catch {
        console.log(error);
    }
}

//ce controller est un middleware
exports.isLoggedIn = async (req, res, next) => {
    // req.message = "Inside middleware";
    // console.log(req.cookies);
    if(req.cookies.jwt){ //si il y a un jtw cookie
        try{
            //1) verify the token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            console.log(decoded);
            //2) check if the user still exist : on verifie que l'id décodé dans le token corresponde à l'id de l'utilsateur
            db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (error, results) => {
                // console.log(results);
                //si aucun utilsateur coorespond à ce token alors next
                if(!results){
                    return next();
                }
                //on récupère les données de l'utilisateur connecté
                req.user = results[0];
                return next();
            });
        } catch (error){
            console.log(error);
            return next();
        }
    } else {
        next(); //on utilise des next car c'est un middleware
    }
    //si dans les cookies on retrouve le token jwt et que ce dernier correspond à l'id de l'utilisateur, alors la fonction isLoggedIn renvoie req.user avec ses données. Si le token n'est pas bon alors non.
}

exports.logout = async (req, res, next) => {
    //we send a new cookie expiring in 2sec which is gonna overwrite the previous one
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 2*1000),
        httpOnly: true
        //httpOnly pour eviter les attaques du genre ssh, rend possible uniquement via browser / http
    });
    res.status(200).redirect('/');
    //status 200 tout va bien
}