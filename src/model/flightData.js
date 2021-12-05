
const mongoose = require('mongoose');

const flightData = mongoose.model('filight_data', {
    flight_id: {
        type: String
    },
    destination: {
        type: String 
    },
    from:{
        type: String
    },
    date:{
        type: Date
    },
    landing_date:{
        type: Date
    }
},'filight_data');

module.exports = flightData;