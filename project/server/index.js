require('crypto').randomBytes(64).toString('hex')
var Database = require('./database');
const fs = require('fs');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
let app = express();
let PORT = 5000;
app.use(bodyParser.json());
const TOKEN_SECRET = require('crypto').randomBytes(64).toString('hex');

var db = new Database.Database();
var connection = db.getConnection();

https.createServer({
    key: fs.readFileSync('docencia.key'),
    cert: fs.readFileSync('docencia.crt')
}, app).listen(PORT, function () {
    console.log("Servidor HTTPS escoltant al port" + PORT + "...");
});



app.get('/', (req, res) => {
    res.send('You\'re not supposed to be here');
});

app.get('/fecha', (req, res) => {
    res.send(Date());
});

app.get('/testMySQL', (req, res) => {
    connection.query('SHOW DATABASES', function (err, rows, fields) {
        if (err) throw err;
        res.send(rows);
    });
});

app.post('/register', (req, res) => {
    let querySearchDni = "select count(dni) from dni_profe where dni = '" + req.body["dni"] + "'";
    let querySearchUser = "select count(*) from users where username = '" + req.body["username"] + "'";
    let queryInsertUser = 'INSERT INTO users VALUES (NULL, \'' + req.body["username"] + '\',\'' + req.body["password"] + '\',\'' + req.body["full_name"] + '\',NULL)';
    let role = ""
    if (req.body.hasOwnProperty("dni") && req.body.hasOwnProperty("username") && req.body.hasOwnProperty("password") && req.body.hasOwnProperty("full_name") && req.body.hasOwnProperty("avatar")) {
        //Comproba que el usuari no existeix, i si així es, continúa amb els "inserts"
        connection.query(querySearchUser, function (err, rows, fields) {
            if (rows[0]["count(*)"] == 0) {
                //Inserta un usuari i guarda el ID de este
                connection.query(queryInsertUser, function (err, rows, fields) {
                    if (err) throw err;
                    let id = rows['insertId'];
                    let queryInsertAlu = "INSERT INTO alumne VALUES (" + id + ", 0, '0')";
                    let queryInsertProf = "INSERT INTO professor VALUES (" + id + ", NULL)";
                    //Comproba si el usuari insertat es profesor o no
                    connection.query(querySearchDni, function (err, rows, fields) {
                        if (err) throw err;
                        for (a in rows) {
                            if (rows[a]['count(dni)'] == 0) {    //Inserta un alumne
                                connection.query(queryInsertAlu, function (err, rows, fields) {
                                    if (err) throw err;
                                    var textJson = '{"user_id": ' + id + ',"username": "' + req.body["username"] + '","role": "alumne"}';
                                    var objJson = JSON.parse(textJson);
                                    // expires after half and hour (6400 seconds = 120 minutes = 2 hours)
                                    let token = jwt.sign(objJson, TOKEN_SECRET, { expiresIn: '6400s' });
                                    res.json(token);
                                    console.log(jwt.decode(token, TOKEN_SECRET));
                                });
                            } else {    //Inserta un profesor
                                connection.query(queryInsertProf, function (err, rows, fields) {
                                    if (err) throw err;
                                    var textJson = '{"user_id": ' + id + ',"username": "' + req.body["username"] + '","role": "profe"}';
                                    var objJson = JSON.parse(textJson);
                                    // expires after half and hour (6400 seconds = 120 minutes = 2 hours)
                                    let token = jwt.sign(objJson, TOKEN_SECRET, { expiresIn: '6400s' });
                                    res.json(token);
                                    console.log(jwt.decode(token, TOKEN_SECRET));
                                });
                            }
                        }
                    });
                });
            } else {
                var textJson = '{"reg_error":"user already exists"}';
                var objJson = JSON.parse(textJson);
                res.json(objJson);
            }
        })
    } else {
        res.send("Objecte json invalid");
    }
});

app.post('/login', (req, res) => {
    let queryValidateUser = "select id from users where username = '" + req.body["username"] + "' and password = '" + req.body["password"] + "'";
    if (req.body.hasOwnProperty("username") && req.body.hasOwnProperty("password")) {
        //Comproba que el usuari es valid, en cas afirmatiu, busca el id del usuari a la taula professors per saber si es un profe o no,
        //Acte seguit, retorna un token jwt o un altre depenent del resultat.
        connection.query(queryValidateUser, function (err, rows, fields) {
            if (rows != undefined) {
                let id = rows[0]['id'];
                let querySearchRole = "select count(*) from professor where id_professor = '" + id + "'";
                connection.query(querySearchRole, function (err, rows, fields) {
                    if (err) throw err;
                    if (rows[0]["count(*)"] == 1) {
                        var textJson = '{"user_id": ' + id + ',"username": "' + req.body["username"] + '","role": "profe"}';
                        var objJson = JSON.parse(textJson);
                        // expires after half and hour (6400 seconds = 120 minutes = 2 hours)
                        let token = jwt.sign(objJson, TOKEN_SECRET, { expiresIn: '6400s' });
                        res.json(token);
                        console.log(jwt.decode(token, TOKEN_SECRET));
                    } else {
                        var textJson = '{"user_id": ' + id + ',"username": "' + req.body["username"] + '","role": "alumne"}';
                        var objJson = JSON.parse(textJson);
                        // expires after half and hour (6400 seconds = 120 minutes = 2 hours)
                        let token = jwt.sign(objJson, TOKEN_SECRET, { expiresIn: '6400s' });
                        res.json(token);
                        console.log(jwt.decode(token, TOKEN_SECRET));
                    }
                });
            } else {
                var textJson = '{"log_error":"user does not exists or password is incorrect"}';
                var objJson = JSON.parse(textJson);
                res.json(objJson);
            }
        })
    } else {
        var textJson = '{"log_error":"Incompatible json was received"}';
        var objJson = JSON.parse(textJson);
        res.json(objJson);
    }
});