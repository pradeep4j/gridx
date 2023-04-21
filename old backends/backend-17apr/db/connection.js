const mongoose = require('mongoose');

mongoose.connect(
    "mongodb://127.0.0.1:27017/",
    {
        dbName: "gridx",
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).then(()=>{  //if promise fullfills this will execute
    console.log(`Connected to gridx database`);
}).catch((e)=>{  //if promise does not fullfills this will execute
    console.log(e);
});