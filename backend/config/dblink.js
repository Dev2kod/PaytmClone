const mongoose = require("mongoose");

 const dblink=async ()=>{
   try { await mongoose.connect("mongodb+srv://admin:devesh2309@cluster0.zbiemu9.mongodb.net/paytm");
    console.log("db connected");
   } catch (error) {
    console.log(error)
   } 
};

module.exports = dblink;