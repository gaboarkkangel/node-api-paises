var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override");
// mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

var countriesCtrl = require('./controllers/countries');

var countries = express.Router();

countries.route('/countries')
    .get(countriesCtrl.countriesAll);


countries.route('/countries/:name')
    .get(countriesCtrl.countriesbyTerm);

countries.route('/countries/multiple/:array')
    .get(countriesCtrl.countriesArrayTerm);

app.use('/api', countries);




app.listen(4000, function() {
    console.log("Node server running on http://localhost:4000");
});