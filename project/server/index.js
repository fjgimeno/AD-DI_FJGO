require('crypto').randomBytes(64).toString('hex')
var Database = require('./database');
const fs = require('fs');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const { text } = require('express');
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
                                });
                            } else {    //Inserta un profesor
                                connection.query(queryInsertProf, function (err, rows, fields) {
                                    if (err) throw err;
                                    var textJson = '{"user_id": ' + id + ',"username": "' + req.body["username"] + '","role": "profe"}';
                                    var objJson = JSON.parse(textJson);
                                    // expires after half and hour (6400 seconds = 120 minutes = 2 hours)
                                    let token = jwt.sign(objJson, TOKEN_SECRET, { expiresIn: '6400s' });
                                    res.json(token);
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
            if (rows.length > 0) {
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
                    } else {
                        var textJson = '{"user_id": ' + id + ',"username": "' + req.body["username"] + '","role": "alumne"}';
                        var objJson = JSON.parse(textJson);
                        // expires after half and hour (6400 seconds = 120 minutes = 2 hours)
                        let token = jwt.sign(objJson, TOKEN_SECRET, { expiresIn: '6400s' });
                        res.json(token);
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

app.get('/notes', (req, res) => {
    var fullUrl = req.protocol + '://' + req.get('host')
    if (req.body.hasOwnProperty("token")) {
        let token = req.body["token"];
        var objJson = jwt.decode(token, TOKEN_SECRET);
        if (objJson["role"] == "alumne") {
            let querySearchNotes = "select * from notes where id_alumne = '" + objJson["user_id"] + "'";
            connection.query(querySearchNotes, function (err, rows, fields) {
                console.log("Comprovant notes...")
                var textJson = '{"ok": true,"data": []}';
                var objJson = JSON.parse(textJson);
                var valuesJson = []
                for (var i = 0; i < rows.length; i++) {
                    let assig = "";
                    var textJsonBorr = '{"id_profe": ' + rows[i]["id_profe"] + ',"id_assig": ' + rows[i]["id_assig"] + ',"nota": ' + rows[i]["nota"] + ', "links":{"get":"GET ' + fullUrl + '/assignatura/' + rows[i]["id_assig"] + '"}' + '}';
                    var objJsonBorr = JSON.parse(textJsonBorr);
                    valuesJson.push(objJsonBorr);
                }
                objJson["data"] = valuesJson;
                res.json(objJson);
            });
        } else {
            var textJson = '{"notes_error":"Teachers do not have grades"}';
            var objJson = JSON.parse(textJson);
            res.json(objJson);
        }
    }
});

app.get('/notes/:id', (req, res) => {
    var fullUrl = req.protocol + '://' + req.get('host')
    if (req.body.hasOwnProperty("token")) {
        let token = req.body["token"];
        var objJson = jwt.decode(token, TOKEN_SECRET);
        if (objJson["role"] == "alumne") {
            let querySearchNotes = "select * from notes where id_alumne = '" + objJson["user_id"] + "' and id_assig = '" + req.params.id + "'";
            connection.query(querySearchNotes, function (err, rows, fields) {
                console.log("Comprovant notes...")
                var textJson = '{"ok": true,"data": []}';
                var objJson = JSON.parse(textJson);
                var valuesJson = []
                for (var i = 0; i < rows.length; i++) {
                    var textJsonBorr = '{"id_profe": ' + rows[i]["id_profe"] + ',"id_assig": ' + rows[i]["id_assig"] + ',"nota": ' + rows[i]["nota"] + ', "links":{"get":"GET ' + fullUrl + '/assignatura/' + rows[i]["id_assig"] + '"}' + '}';
                    var objJsonBorr = JSON.parse(textJsonBorr);
                    valuesJson.push(objJsonBorr);
                }
                objJson["data"] = valuesJson;
                res.json(objJson);
            });
        } else {
            var textJson = '{"notes_error":"Teachers do not have grades"}';
            var objJson = JSON.parse(textJson);
            res.json(objJson);
        }
    }
});

app.get('/assignatura/:id', (req, res) => {
    var fullUrl = req.protocol + '://' + req.get('host')
    let queryAssigInfo = "select * from assignatura where id_assig = '" + req.params.id + "'";
    connection.query(queryAssigInfo, function (err, rows, fields) {
        console.log("Comprovant notes...")
        var textJson = '{"ok": true,"data": []}';
        var objJson = JSON.parse(textJson);
        var valuesJson = []
        for (var i = 0; i < rows.length; i++) {
            var textJsonBorr = '{"id_assig": ' + req.params.id + ',"cod_assig": "' + rows[i]["cod_assig"] + '","nom_assig": "' + rows[i]["nom_assig"] + '","modul": "' + rows[i]["modul"] + '","curs": ' + rows[i]["curs"] + ',"hores": ' + rows[i]["hores"] + '}';
            var objJsonBorr = JSON.parse(textJsonBorr);
            valuesJson.push(objJsonBorr);
        }
        objJson["data"] = valuesJson;
        res.json(objJson);
    });
});

app.get('/moduls', (req, res) => {
    var fullUrl = req.protocol + '://' + req.get('host')
    if (req.body.hasOwnProperty("token")) {
        let token = req.body["token"];
        var objJson = jwt.decode(token, TOKEN_SECRET);
        if (objJson["role"] == "profe") {
            let queryAssig = "select * from assignatura";
            connection.query(queryAssig, function (err, rows, fields) {
                var textJson = '{"ok": true,"data": []}';
                var objJson = JSON.parse(textJson);
                var valuesJson = []
                for (var i = 0; i < rows.length; i++) {
                    for (var i = 0; i < rows.length; i++) {
                        var textJsonBorr = '{"id_assig": ' + rows[i]["id_assig"] + ',"cod_assig": "' + rows[i]["cod_assig"] +
                            '","nom_assig": "' + rows[i]["nom_assig"] + '","modul": "' + rows[i]["modul"] + '","curs": ' + rows[i]["curs"] +
                            ',"hores": ' + rows[i]["hores"] + '}';
                        var objJsonBorr = JSON.parse(textJsonBorr);
                        valuesJson.push(objJsonBorr);
                    }
                    var objJsonBorr = JSON.parse(textJsonBorr);
                    valuesJson.push(objJsonBorr);
                }
                objJson["data"] = valuesJson;
                res.json(objJson);
            });
        } else {
            var textJson = '{"permission_error":"Students are not allowed to do this"}';
            var objJson = JSON.parse(textJson);
            res.json(objJson);
        }
    }
});

app.get('/moduls/:id', (req, res) => {
    var fullUrl = req.protocol + '://' + req.get('host')
    let token = req.body["token"];
    var objJson = jwt.decode(token, TOKEN_SECRET);
    if (objJson.hasOwnProperty("user_id") && objJson.hasOwnProperty("username") && objJson.hasOwnProperty("role") && objJson.hasOwnProperty("iat") && objJson.hasOwnProperty("exp")) {
        if (objJson["role"] == "profe") {
            let querySearchNotes = "select * from notes where id_assig = '" + req.params.id + "'";
            connection.query(querySearchNotes, function (err, rows, fields) {
                console.log("Comprovant notes...")
                var textJson = '{"ok": true,"data": []}';
                var objJson = JSON.parse(textJson);
                var valuesJson = []
                for (var i = 0; i < rows.length; i++) {
                    var textJsonBorr = '{' + '"id_alumne": ' + rows[i]["id_alumne"] + ',"id_profe": ' + rows[i]["id_profe"] + ',"id_assig": ' + rows[i]["id_assig"] + ',"nota": ' + rows[i]["nota"] + ', "links":{' +
                        '"assig":"GET ' + fullUrl + '/assignatura/' + rows[i]["id_assig"] + '",' +
                        '"alumne":"GET ' + fullUrl + '/alumne/' + rows[i]["id_alumne"] + '",' +
                        '"nota":"GET ' + fullUrl + '/moduls/' + rows[i]["id_assig"] + '/' + + rows[i]["id_alumne"] + '"' +
                        '}' + '}';
                    var objJsonBorr = JSON.parse(textJsonBorr);
                    valuesJson.push(objJsonBorr);
                }
                objJson["data"] = valuesJson;
                res.json(objJson);
            });
        } else {
            var textJson = '{"permission_error":"Students can not see grades of other students"}';
            var objJson = JSON.parse(textJson);
            res.json(objJson);
        }
    }
});


/*Exemple postman:
{
    "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0OSwidXNlcm5hbWUiOiJ0ZXN0cHJvZmUiLCJyb2xlIjoicHJvZmUiLCJpYXQiOjE2MTQ1MjUyNzMsImV4cCI6MTYxNDUzMTY3M30.9iYhZfv_qsYUvWPfB6wCdqcMU2urpS72yw6TELyTfaw",
    "nota":3
}
*/
app.put('/moduls/:id_modul/:id_alumne', (req, res) => {
    var fullUrl = req.protocol + '://' + req.get('host')

    if (req.body.hasOwnProperty("nota") && req.body.hasOwnProperty("token")) {
        let token = req.body["token"];
        var objJson = jwt.decode(token, TOKEN_SECRET);
        if (objJson["role"] == "profe") {
            console.log(req.params.id_modul, objJson["user_id"], req.params.id_alumne, req.body["nota"]);
            let queryInsertGrade = "INSERT INTO notes VALUES (" + req.params.id_alumne + ", " + objJson["user_id"] + ", " + req.params.id_modul + ", " + req.body["nota"] + ")";
            console.log("beggining transaction")
            connection.query(queryInsertGrade, function (err, rows, fields) {
                if (err) {
                    var objJson = JSON.parse('{"ok": false, "error":"' + err + '"}');
                    res.json(objJson);
                } else {
                    var objJson = JSON.parse('{"ok": true}');
                    res.json(objJson);
                }
            });
        } else {
            var textJson = '{"operation_eror":"User is not a teacher"}';
            var objJson = JSON.parse(textJson);
            res.json(objJson);
        }
    }
});