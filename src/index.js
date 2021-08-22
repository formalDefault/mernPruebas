const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();
const { mongoose } = require('./database');
//configuraciones
app.set('port', process.env.PORT || 3000);
//middlewares
app.use(morgan('dev'));
app.use(express.json());
//routes
app.use('/api/tasks', require('./routes/task-routes'));
//Front end, se necesita compilar para ver cambios
app.use(express.static(path.join(__dirname, 'public')));
//star server

app.listen(app.get('port'), () => {
    console.log(`servidor ${app.get('port')} iniciado`);
});