const express = require("express");
const app = express();

const path = require("path");
const cookieParser = require("cookie-parser");

const db = require("./config/db");
db.connect( (error) => {
    if(error){
        console.log(error)
    } else {
        console.log("Connected to MYSQL...")
    }
});


const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory)); // make sure express server is using the public directory

// Parse URL-encoded bodies (as sent by HTML forms) / pour récuperer données des formulaires
app.use(express.urlencoded({ extended: false }));
// Parse JSON bodies (as sent by API clients) / pour s'assurer que les données récupérées sont au format JSON
app.use(express.json());
app.use(cookieParser());

app.set('views', path.join(__dirname, 'views')); // optionnel
app.set('view engine', 'hbs'); // Indique à Express que le moteur de templating à utiliser est Handlebars.js

// Defining routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/authRouter'));

// starting server
app.listen(5000, () => {
    console.log("server started on port 5000")
});