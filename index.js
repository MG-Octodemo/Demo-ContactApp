// crear un servidor web utilizando express
const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure EJS as the view engine and set the views directory
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

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
    // Create a new Contact instance from req.body and add it to contactList
    const newContact = new Contact(req.body.name, req.body.id, req.body.company);
    contactList.push(newContact);
    // redirige al home page
    res.redirect('/');
});

// Add a GET route for /contactList that renders the contactList.ejs view with the contactList data
app.get('/contactList', (req, res) => {
    res.render('contactList', { contacts: contactList });
});

// Add a POST route for /contactList to handle sorting of contacts based on a specified attribute
app.post('/contactList', (req, res) => {
    const { sortKey } = req.body;
    contactList.sort((a, b) => (a[sortKey] > b[sortKey]) ? 1 : -1);
    res.render('contactList', { contacts: contactList });
});
