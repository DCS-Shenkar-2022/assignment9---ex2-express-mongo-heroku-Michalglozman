const express= require ('express');
require('../db/mongoose');
const flightData = require('../model/flightData');
const checkWheater = require('../weather/weatherApi');
const user = require('../model/user');
const { response } = require('express');
const connectedUsers = [];

exports.flightController = {
    auth(req,res) {
        const user_id = req.body.id;
        user.findOne({id:user_id}).then((userData) => {
            if(!userData) {
                return res.status(403).send("Cant find your id");
            }
            let key = (Math.random() + 1).toString(36).substring(7);
            const responseJson = {};
            connectedUsers.push(key);
            console.log("adding " + key + " user " + userData);
            setTimeout(()=>{
                console.log("removing "+key);
                index=connectedUsers.indexOf(key);
                connectedUsers.splice(index, 1);
                console.log("list: " + connectedUsers);
            }, 600*1000);
            responseJson['key'] = key;
            res.send(responseJson);
        }).catch((error) => {
            console.log(error);
            res.status(500);
        })
    },
    middelWeare(req,res, next) {
        const auth = req.headers.authorization;
        if(connectedUsers.includes(auth)){
            return next();
        }
        return res.status(403).send("Ops.. cant find you id");
    },
    updateFlight(req, res) {
        const id = req.params.id;
        flightData.updateMany({flight_id: id},
                                {$set: {destination: req.body.destination,
                                from: req.body.from,
                                flight_id: id,
                                date: req.body.date}}
                            )
                                .then(() => res.send("flight updated"))
                                .catch((e) => {
                                    console.log(e);
                                    res.status(500).send();
                                });
    },
    allFlights(req, res) {
        flightData.find({}).then((flightData) =>{
            res.send(flightData);
        }).catch((e) => {
            res.status(500).send();
        });
    },
    deleteFlight(req, res) {
        const id = req.params.id;
        flightData.findOne({flight_id:id}).then((fight) =>{
            if(!fight){
                return res.status(400).send("Flight dosent exist");
            }
            flightData.deleteOne({ flight_id: id})
            .then(() =>{
                res.send('succes');
            }).catch((error) => {
                console.error("Error when deleting:" + error);
                res.status(400);
            });
        })
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
        const id = req.params.id;
        flightData.findOne({flight_id:id}).then((flightData) => {
            const response = {}
            if(!flightData){
                return res.status(400).send("Can't find fligh");
            }
        checkWheater(flightData.destination,flightData.date).then( (weather) => {
            response['weather'] = weather;
            response['flightData'] = flightData;
            return res.send(response);
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