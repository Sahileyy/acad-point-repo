import {MongoClient, mongoClient} from "mongodb"
const uri = "mongodb://127.0.0.1:27017/"

const client = new MongoClient(uri)

async function connectDB() {

    try{
        await client.connectDB()
        db=client.db('acad-database')
        console.log("database connected");
        

    }
    catch(errr){
        console.log("database not connected",errr);
        
    }
    
}