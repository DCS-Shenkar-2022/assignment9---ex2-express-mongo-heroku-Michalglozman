const express= require ('express');
require('../db/mongoose');
const flightData = require('../model/flightData');
const checkWheater = require('../weather/weatherApi');
const user = require('../model/user');
const { response } = require('express');

const connectedUsers = [];
const userList=[];

exports.flightController = {
    auth(req,res) {
        const user_id = req.body.id;
        user.findOne({id:user_id}).then((userData) => {
            if(!userData) {
                return res.status(400).send("Cant find your id");
            }
            let key = (Math.random() + 1).toString(36).substring(7);
            connectedUsers.push(key);
            console.log("adding " + key + " user " + userData);
    
            setTimeout(()=>{
                console.log("removing "+key);
                index=connectedUsers.indexOf(key);
                connectedUsers.splice(index, 1);
                console.log("list: " + connectedUsers);
            }, 600*1000);
            res.send(key);
        }).catch((error) => {
            console.log(error)
        })
    },
    middelWeare(req,res, next) {
        const auth = req.headers.authorization;
        console.log("auth is : "+auth);
        if(connectedUsers.includes(auth)){
            return next();
        }
        return res.status(400).send("Ops.. cant find you id");
    },
    updateFlight(req, res) {
        const _id = req.body.flight_id;
        console.log(_id);
        flightData.updateMany({flight_id: req.body.flight_id},
                                {$set: {destination: req.body.destination,
                                from: req.body.from,
                                flight_id: req.body.flight_id,
                                date: req.body.date}}
                                //{$set: {date: req.body.date}
                            )
                                .then(() => res.send("flight updated"))
                                .catch((e) => {
                                    console.log(e);
                                    res.status(500).send();
                                })
    },
    allFlights(req, res) {
        flightData.find({}).then((flightData) =>{
            res.send(flightData);
        }).catch((e) => {
            res.status(500).send();
        });
    },
    deleteFlight(req, res) {
        flightData.deleteOne({ flight_id: req.query.id})
        .then(() =>res.send('succes'))
        .catch((error) => {
            console.error("Error when deleting:" + error)
        });
    },
    newFlight(req, res) {
        const flight = new flightData(req.body);
        flight.save().then(() =>{
            res.status(200).send(flight);
        }).catch((e) => {
            console.error("Error When adding new flight" + e);
            res.status(500);
        })
    },
    flightData(req, res) {
        const _id = req.params.id;
    flightData.findOne({flight_id:_id}).then((flightData) => {
        const response = {}
        if(!flightData){
            return res.status(404).send();
        }
        checkWheater(flightData.destination,flightData.date).then( (weather) => {
            response['weather'] = weather;
            response['flightData'] = flightData;
            return res.send(response)
            
        }).catch((e) => {
            console.error(e);
            res.status(500).send();
        });

        
    }).catch((e) => {
        console.error(e);
        res.status(500).send();
    });
    },

    

}