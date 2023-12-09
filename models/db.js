const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/LoginSystem',{useNewUrlParser:true,useUnifiedTopology:true},(err)=>{
    if(!err) {console.log("MongoDB Connected Succesful");}
    else
    console.log("Problem occur"+err);
})
