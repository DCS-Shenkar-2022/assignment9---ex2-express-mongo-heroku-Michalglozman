
require('./src/db/mongoose');
const express= require ('express');
const {flightController} = require('./src/controllers/flightController');
const app= express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post('/auth', flightController.auth);

app.all("*", flightController.middelWeare);

app.get('', (req,res) =>{
    res.status(404).send('page not found');
})
app.post('/updateFlight',flightController.updateFlight);
app.get('/allFlights', flightController.allFlights);
app.get('/deleteFlight',flightController.deleteFlight);
app.post('/newFlight', flightController.newFlight)
app.get('/flightData/:id', flightController.flightData)

app.listen(process.env.POST || 80, ()=> {
    console.log('Server on');
});