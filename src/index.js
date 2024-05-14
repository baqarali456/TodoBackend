import { app } from "./app.js";
import { connectDB } from "./db/db.js";

require('dotenv').config({path:"./.env"})


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 4000,()=>{
        console.log("SERVER LISTENING ON PORT",process.env.PORT)
    })
    app.on("error",(error)=>{
      console.log("SERVER CONNECTION PROBLEM",error)
    })
})
.catch((error)=>{
   console.log("ERROR ON EXPRESS APP",error)
})