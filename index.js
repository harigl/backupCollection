const express = require('express'); //Import the express dependency
const app = express();              //Instantiate an express app, the main work horse of this server
const port = 5000;                  //Save the port number where your server will be listening
const {MongoClient} = require('mongodb');
const {config} = require('./config/config.js');
const uri = "mongodb://localhost:27017/?directConnection=true";
const client = new MongoClient(uri);

async function main() {
    // we'll add code here soon
    try {
        await client.connect();
        console.log('success....');
        await listDatabases(client);
     
    } catch (e) {
        console.error(e);
    }
}
async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:",databasesList.databases.test);

    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
    await backup(client,'test','test-backup');
};

//backup()
async function backup(clnt,tbl,backup_tbl){
    const dbs = client.db('demo');
    // const test = await db.collection('test');
    // const test_backup = await dbs.collection('test-backup');
    // console.log('==========test is......',test);
    // const day = 1;

    MongoClient.connect("mongodb://localhost:27017/demo", function(err, db) {
       if(err){
           console.log('.................................return error..........',err);
       }
       else{
           var collection = dbs.collection(config.tableName);
           const query = collection.aggregate([
            {$match : { [config.dateField]: {'$gte': new Date(new Date() - config.days * 60 * 60 * 24 * 1000),} }} ,
           
               {$out: config.backupTableName
           }]).toArray(function(err,items){
               if(err){
                   console.log('error is.............',err);
               }
               else{
                   console.log('items is..............',items);
               }
           });
           console.log('yes ok finish.11111111111..');
       }
    });
    console.log('yes ok finish...');


}
main().catch(console.error);
//Idiomatic expression in express to route and respond to a client request
app.get('/', (req, res) => {        //get requests to the root ("/") will route here
    res.sendFile('index.html', {root: __dirname});      //server responds by sending the index.html file to the client's browser
                                                        //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
});
app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`); 
});
// mongodb://localhost:27017/?directConnection=true