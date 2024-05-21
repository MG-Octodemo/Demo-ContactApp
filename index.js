// crear un servidor web utilizando express
const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse URL-encoded body data
app.use(express.urlencoded({extended: true}));
// Middleware to parse JSON body data
app.use(express.json());

// configurar la ruta raiz hacia index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

// iniciar el servidor web
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

// agregar ruta de contactAdd hacia contactAdd.html
app.get('/contactAdd', (req, res) => {
    res.sendFile(__dirname + '/views/contactAdd.html');
});

// crear clase de Contact con atributos name id y company
class Contact {
    constructor(name, id, company) {
        this.name = name;
        this.id = id;
        this.company = company;
    }
}

// crear lista de contactos
let contactList = [];

// agregar metodo post para agregar un contacto
app.post('/contactAdd', (req, res) => {
    // Crear una nueva instancia de Contact con datos de req.body
    const newContact = new Contact(req.body.name, req.body.id, req.body.company);
    // Agregar el nuevo contacto a la lista de contactos
    contactList.push(newContact);
    // redirige al home page
    res.redirect('/');
});

// Agregar ruta GET para contactList
app.get('/contactList', (req, res) => {
    // Renderizar la vista contactList.ejs con los datos de la lista de contactos
    res.render('contactList', { contacts: contactList });
});
