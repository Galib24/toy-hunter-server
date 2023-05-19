const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_PASS);






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z8yqdyj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const categoryCollection = client.db('toyHunter').collection('categories');
        const categoryCollection1 = client.db('toyHunter').collection('categories1');
        const categoryCollection2 = client.db('toyHunter').collection('categories2');
        const categoryCollection3 = client.db('toyHunter').collection('categories3');
        const orderCollection = client.db('toyHunter').collection('orders')

        app.get('/categories', async (req, res) => {
            const cursor = categoryCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });
        app.get('/categories1', async (req, res) => {
            const cursor = categoryCollection1.find();
            const result = await cursor.toArray();
            res.send(result);
        });
        app.get('/categories2', async (req, res) => {
            const cursor = categoryCollection2.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/categories3', async (req, res) => {
            const cursor = categoryCollection3.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/categories/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }



            const options = {

                // Include only the `title` and `imdb` fields in the returned document
                projection: { title: 1, price: 1, service_id: 1 },
            };
            const result = await categoryCollection.findOne(query, options);
            res.send(result);
        })

        // orders

        app.get('/orders', async (req, res) => {
            console.log(req.query.email);
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await orderCollection.find().toArray();
            res.send(result);
        });



        app.post('/orders', async (req, res) => {
            const order = req.body;
            console.log(order);
            const result = await orderCollection.insertOne(order);
            res.send(result);
        });

        app.put('orders/:id', async(req, res)=>{
            const updatedOrders = req.body;
        })





        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        });






        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('toy is running');
})


app.listen(port, () => {
    console.log(`toy is running on port: ${port}`);
})