const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.DB_URI, {useNewUrlParser:true, useUnifiedTopology: true})
    .then(data => {
        console.log('successfully connected to the db');
    }).catch(err => {
        console.log('err in conecting with db', err);
    }) 
}

module.exports = connectDatabase;