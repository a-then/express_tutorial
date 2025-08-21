// This line of code below will load your configuration from .env as long as it exists
require("dotenv").config();

// express package is used to set up express web APIS
const express = require("express")
const mongoose = require("mongoose"); // uncomment this line for lesson 3 of express
const itemModel = require("./models/items"); // uncomment this line for lesson 3 of express
// cors package is used to handle cross origin requests to the API server
const cors = require("cors");
// You need to set up a port that your express application will run on
const PORT = process.env.PORT || 3500;
const dbURL = process.env.dbURL; // uncomment this line for lesson 3 of express

// uncomment the following 3 lines for lesson 3 of express
mongoose.connect(dbURL)
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error(err.message))

const app = express();

// Express middleware
// using the cors middleware
app.use(cors());
// need to use express.json() to be able to parse incoming HTTP requests
app.use(express.json());
// the express.urlencoded middleware allows your API to handle working with complex data such as arrays and objects
app.use(express.urlencoded({ extended: true }));

// HTTP GET Endpoint on index route
app.get("/", (req, res) => {
    const messageQuery = req.query.message;
    const message = `Welcome to your first Express API for Path2Tech, query: ${messageQuery}`;
    res.status(200).json({ "message": message });
});

// HTTP GET Endpoint on /items route
app.get("/items/", async(req, res) => {
    try {
        const items = await itemModel.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
        
    }
});

// HTTP POST Endpoint on /items route
app.post("/items/", async(req, res) => {
    try {
        const newItem = new itemModel(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// HTTP PUT Endpoint on /items/:id route
app.put("/items/:id", async(req, res) => {
    try {
        const itemId = req.params.id;
        const updatedItem = await itemModel.findByIdAndUpdate(itemId, req.body, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ error: "Item not found" });
        }
                res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    
});

// HTTP DELETE Endpoint on /items/:id route
app.delete("/items/:id", async(req, res) => {
    try {
        // itemId variable retrieves the dynamic id from the URL parameters
        const itemId = req.params.id;
        // this line will attempt to find an item by its id and delete it from the database
        const deletedItem = await itemModel.findByIdAndDelete(itemId);
        // checks if an item was removed from the database, if it was NOT, then we will execute a 404 not found error
        if (!deletedItem){
            return res.status(404).json({ error: "Item not found" });
        }
        // If there are no errors, we let the client know that the item was deleted
        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});
