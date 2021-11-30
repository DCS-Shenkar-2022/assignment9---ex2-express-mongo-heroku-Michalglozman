const express= require ('express');
require('./db/mongoose')
const flightData = require('./model/flightData')
const user = require('./model/user')
const app= express();


// middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('', (req,res) =>{
    res.send('welcome')
})

app.post('/updateFlight',(req,res) =>{     //when you do update you can edit all data
    const _id = req.body.flight_id
    console.log(_id)
    flightData.updateMany({flight_id: req.body.flight_id},
                            {$set: {destination: req.body.destination,
                            from: req.body.from,
                            flight_id: req.body.flight_id,
                            date: req.body.date}}
                            //{$set: {date: req.body.date}
                        )
                            .then(() => res.send("flight updated"))
                            .catch((e) => {
                                console.log(e)
                                res.status(500).send()
                            })
})

app.get('/getAllFlights',(req,res)=>{
    flightData.find({}).then((flightData) =>{
        res.send(flightData)
    }).catch((e) => {
        res.status(500).send()
    })
    

})
app.get('/delFlight',(req,res) => {
    flightData.deleteOne({ flight_id: req.query.id}).then(() =>res.send('succes'))
})
app.post('/addFlight', (req,res) => {
    console.log(req.body)
    const flight = new flightData(req.body)
    flight.save().then(() =>{
        res.status(201).send(flight)
    }).catch((e) => {
        console.log(e)
        res.status(500).send(e)
    })
})
app.get('/getFlight/:id',(req,res) => {
    const _id = req.params.id
    console.log(_id)
    flightData.find({flight_id:_id}).then((flightData) => {
        if(!flightData){
            return res.status(404).send()
        }
        return res.send(flightData)
    }).catch((e) => {
        res.status(500).send()
    })

})
app.listen(80, ()=> {
    console.log('Server on')
});