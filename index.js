import { app } from "./src/app.js";
import { connectDB } from "./src/db/db.js";
import dotenv from "dotenv";

dotenv.config()

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 4000,()=>{
        console.log("SERVER LISTENING ON PORT",process.env.PORT)
    })
    app.on("error",(error)=>{
      console.log("SERVER CONNECTION PROBLEM",error)
      process.exit()
    })
})
.catch((error)=>{
   console.log("ERROR ON EXPRESS APP",error)
})