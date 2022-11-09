const mongoClient = require('mongodb').MongoClient;
mongoClient.connect("mongodb+srv://gui:gui@cluster0.ccsbbat.mongodb.net/?retryWrites=true&w=majority",
    {
        useUnifiedTopology: true
    },
    (err, con) => {
        if(err) return console.log(err)
        global.db = con.db("academia");
        console.log('conectado!')
    }
)


module.exports = {}