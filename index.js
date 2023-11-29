const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const uri = `mongodb+srv://${process.env.SECRET_USERNAME}:${process.env.SECRET_PASSWORD}@cluster0.zlotju8.mongodb.net/?retryWrites=true&w=majority`;
const uri = process.env.MONGOURI;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri);
app.get("/", (req, res) => {
  res.send("Server is running .");
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    await client.db("admin").command({ ping: 1 });
    const database = client.db("booksDb");
    const bookCollection = database.collection("collection");

    app.post("/books/:addedBy", async (req, res) => {
      books.push(req.body);
      console.log(req.body);

      const result = await bookCollection.insertOne(req.body);
      res.send(result);
    });

    app.get("/books/:addedBy", async (req, res) => {
      const addedBy = req.params.addedBy;
      const query = { addedBy: addedBy };
      const result = await bookCollection.find(query).toArray();
      //console.log(result);
      res.send(result);
    });

    app.get("/books/:addedBy/:id", async (req, res) => {
      const addedBy = req.params.addedBy;
      const id = req.params.id;

      const query = { addedBy: addedBy, id: new ObjectId(id) };
      const result = await bookCollection.findOne(query).toArray();
      //console.log(result);
      res.send(result);
    });
    app.delete("/books/:addedBy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookCollection.deleteOne(query);
      res.send(result);
    });
    app.put("/books/:addedBy/:id", async (req, res) => {
      const id = req.body._id;
      const updatedBook = req.body;
      const filter = { _id: new ObjectId(id) };

      console.log("update book :", updatedBook);
      const updateDoc = {
        $set: {
          title: updatedBook.title,
          author: updatedBook.author,
          date: updatedBook.date,
          genre: updatedBook.genre,
          details: updatedBook.details,
        },
      };

      const result = await bookCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(5000, () => console.log("listening on port"));
