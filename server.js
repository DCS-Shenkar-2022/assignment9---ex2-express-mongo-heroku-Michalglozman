
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
app.put('/flights/:id',flightController.updateFlight);
app.get('/flights', flightController.allFlights);
app.delete('/flights/:id',flightController.deleteFlight);
app.post('/flights', flightController.newFlight);
app.get('/flights/:id', flightController.flightData);

app.listen(process.env.POST || 80, ()=> {
    console.log('Server on');
});