var Request = require("request");
// GET ALL COUNTRIES
exports.countriesAll = function(req, res) {
    Request.get('https://restcountries.eu/rest/v2/all', (err, resp, body) => {
        if (err) return res.status(500).send(err.message);
        res.send(body);
    })
};
// GET COUNTRIES FOR FULL NAME   // GET COUNTRIES FOR TERM
exports.countriesbyTerm = function(req, res) {
        var response = [];
        // GET COUNTRIES FOR FULL NAME
        if (req.query.fullText) {
            console.log('=== FULLNAME ====');
            let url = req.params.name.trim();
            Request.get('https://restcountries.eu/rest/v2/name/' + url + '?fullText=true', (err, resp, body) => {
                    if (err) return res.status(500).send(err.message);
                    console.log(resp.statusCode);
                    if (resp.statusCode == 404) {
                        res.send(body);
                    } else {
                        let bodyParse = JSON.parse(body);
                        console.log(JSON.parse(body));
                        response = [{
                            name: bodyParse[0].name,
                            capital: bodyParse[0].capital,
                            altSpellings: bodyParse[0].altSpellings,
                            region: bodyParse[0].region,
                            currencies: bodyParse[0].currencies,
                            flag: bodyParse[0].flag
                        }]
                        res.status(200).send(response);
                    }
                })
                // GET COUNTRIES FOR TERM
        } else {
            console.log(`entro en countriesbyTerm`);
            Request.get('https://restcountries.eu/rest/v2/name/' + req.params.name, (err, resp, body) => {
                if (err) return res.status(500).send(err.message);
                if (resp.statusCode == 404) {
                    res.send(body);
                } else {
                    let bodyParse = JSON.parse(body);
                    bodyParse.map(({ name, altSpellings, flag }) => {
                        country = { name, altSpellings, flag }
                        response.push(country);
                    });
                    res.status(200).send(response);
                }
            })
        }
    }
    // GET ARRAY TERM
exports.countriesArrayTerm = function(req, res) {

    body = req.params.array;

    body = body.split(";");

    function promiseArray(value) {
        return new Promise(function(fulfill, reject) {
            Request.get('https://restcountries.eu/rest/v2/name/' + value, (err, resp, body) => {
                if (err) return res.status(500).send(err.message);
                if (resp.statusCode == 404 || resp.statusCode == 400) {
                    fulfill({ find: value, data: null });
                } else {
                    let response = [];
                    let obj = JSON.parse(body)
                    obj.map(filter => {
                        let country = {
                            name: filter.name,
                            capital: filter.capital,
                            altSpellings: filter.altSpellings,
                            region: filter.region,
                            currencies: filter.currencies,
                            flag: filter.flag
                        };
                        response.push(country);
                    });
                    fulfill({ find: value, data: response });
                }
            });
        });
    }
    var p = [];
    for (var n = 0; n < body.length; n++) {
        p.push(promiseArray(body[n]));
    }
    Promise.all(p).then(function(results) {
        console.log('COMPLENTED');
        res.status(200).send(results);
    });
};