const express = require('express');
const { engine } = require('express-handlebars');
const session = require('express-session');
const db = require('./config/connection')
const PORT = process.env.PORT || 3333;


// const view_routes = require('./controllers/view_routes');
// const user_routes = require('./controllers/user_routes')

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// handlebar middleware
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use(session({
    secret: 'TeiflingBard',
    resave: false,
    saveUninitialized: true,
}));

app.use(express.static('./public'));


// app.use('/', view_routes);
// app.use('/auth', user_routes);

db.sync({force: true})
.then(() => {
    app.listen(PORT, () => console.log(`happy surfing on ${PORT}`));
});  
