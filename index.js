const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qcalb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('traveling');
        const packageCollection = database.collection('packages');
        const orderCollection = database.collection('orders');
        const customersCollection= database.collection('cutomersReview');
        console.log("DB Connected");
        
        // GET API Packages
        app.get('/packages', async (req, res) => {
            const cursor = packageCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // GET API Ordered Packages
        app.get('/orderedpackages', async (req, res) => {
            const cursor = orderCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        //post pckages api
        app.post('/packages',async(req,res)=>{
            const package=req.body;
            const result=await packageCollection.insertOne(package);
            console.log(result);
            res.json(result);
        })

        //Add Order Api
        app.post('/orders',async(req,res)=>{
            const orders=req.body;
            const result=await orderCollection.insertOne(orders);
            res.json(result);
        })


        // GET API Customer Reviews
        app.get('/customersReviews', async (req, res) => {
            const cursor = customersCollection.find({});
            const customersReviews = await cursor.toArray();
            res.send(customersReviews);
        });

        //Get Single Service
        app.get('/packages/details/:id',async(req,res)=>{
            const id=req.params.id;
            console.log(id);
            const query={_id:ObjectId(id)};
            const package=await packageCollection.findOne(query);
            res.json(package);

        })

        //Delete Package Api 
        app.delete('/packages/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const result=await packageCollection.deleteOne(query);
            res.json(result);
        })

        //Delete Order Api 
        app.delete('/orderedpackages/:id',async(req,res)=>{  
            const id=req.params.id;
            console.log(id);
            const query={_id:ObjectId(id)};
            const result=await orderCollection.deleteOne(query);
            res.json(result);
        })
       

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send("Running Genius Server");
})

app.listen(port,()=>{
    console.log("Running Genius Server on Port",port)
})