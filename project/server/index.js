var Database = require('./database');
const fs = require('fs');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
let app = express();
let PORT = 5000;
app.use(bodyParser.json());

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
        console.log(rows);
        res.send(rows);
    });
});

app.post('/register', (req, res) => {
    let testStr = "";
    for (a in req.body){
        testStr = testStr + "\n";
    }
    res.send(testStr);
    /*connection.query('insert into u', function (err, rows, fields) {
        if (err) throw err;
        console.log(rows);
        res.send(rows);
    });*/
});

/*
app.put('/contactos/:id', (req, res) => {
    Contacto.findByIdAndUpdate(req.params.id, {
        $set: {
            nombre: req.body.nombre,
            telefono: req.body.telefono,
            edad: req.body.edad
        }
    }, { new: true }).then(resultado => {
        if (resultado)
            res.status(200).send({ ok: true, resultado: resultado });
        else
            res.status(400).send({ ok: false, error: "No se ha encontrado el contacto" });
    }).catch(error => {
        res.status(400).send({ ok: false, error: "Error actualizando contacto" });
    });
});

app.delete('/contactos/:id', (req, res) => {
    Contacto.findByIdAndRemove(req.params.id).then(resultado => {
        if (resultado)
            res.status(200).send({ ok: true, resultado: resultado });
        else
            res.status(400).send({ ok: false, error: "No se ha encontrado el contacto" });
    }).catch(error => {
        res.status(400).send({ ok: false, error: "Error eliminando contacto" });
    });
});
*/