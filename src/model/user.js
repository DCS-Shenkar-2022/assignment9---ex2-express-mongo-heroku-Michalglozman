
const mongoose = require('mongoose');

const user = mongoose.model('user', {
    id: {
        type: String
    },
    fname: {
        type: String 
    },
    lname:{
        type: String
    }
    },'user')

module.exports = user