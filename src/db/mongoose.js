
const mongoose = require('mongoose')
console.log(process.env.MONGO_PATH)
mongoose.connect(`${process.env.MONGO_PATH}`, {
    useNewUrlParser: true
})