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
            console.log(salt);
            console.log(hashedPassword);

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
            if(!results || !(await bcrypt.compare(password, results[0].mdp))){
                res.status(401).render('login', {
                    message: 'Email ou mot de passe incorrect'
                })
            } else {
                const id = results[0].id;
                // jwt.sign({id} = jwt.sign({id: id}
                const token = jwt.sign({id}, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                }); 
                
                console.log("The token is: " + token)

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect("/");
            }
        })

    } catch {
        console.log(error);
    }
}

exports.isLoggedIn = async (req, res, next) => {
    // req.message = "Inside middleware";
    // console.log(req.cookies);
    if(req.cookies.jwt){
        try{
            //1) verify the token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            console.log(decoded);
            //2) check if the user still exist
            db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (error, results) => {
                console.log(results);
                if(!results){
                    return next();
                }
                req.user = results[0];
                return next();
            });
        } catch (error){
            console.log(error);
            return next();
        }
    } else {
        next();
    }
    //si dans les cookies on retrouve le token jwt et que ce dernier correspond à l'id de l'utilisateur, alors la fonction isLoggedIn renvoie req.user avec ses données. Si le token n'est pas bon alors non.
}