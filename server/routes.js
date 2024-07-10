const express = require("express");
const router = express.Router();
const { getConnectedClient } = require("./database");
const { ObjectId } = require("mongodb");

const getCollection = () => {
    const client = getConnectedClient();
    const collection = client.db("todosdb").collection("todos");
    return collection;
}


router.get("/todos", async (req, res) => {
    const collection = getCollection();
    const todos = await collection.find({}).toArray();
    res.status(200).json(todos);
});


router.post("/todos", async (req, res) => {
    const collection = getCollection();
    let { todo, subtitle, deadline, status } = req.body;

    if (!todo || !deadline || !status) {
        return res.status(400).json({ mssg: "Error: Todo, deadline, and status are required." });
    }

    todo = (typeof todo === "string") ? todo : JSON.stringify(todo);
    const newTodo = await collection.insertOne({ todo, subtitle, deadline: new Date(deadline), status });

    res.status(201).json({ todo, subtitle, deadline, status, _id: newTodo.insertedId });
});


router.delete("/todos/:id", async (req, res) => {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);
    const deletedTodo = await collection.deleteOne({ _id });
    res.status(200).json(deletedTodo);
});


router.put("/todos/:id", async (req, res) => {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);
    const { todo, subtitle, deadline, status } = req.body;

    if (!todo || !deadline || !status) {
        return res.status(400).json({ mssg: "Error: Todo, deadline, and status are required." });
    }

    const updatedTodo = await collection.updateOne(
        { _id },
        { $set: { todo, subtitle, deadline: new Date(deadline), status } }
    );

    res.status(200).json({ todo, subtitle, deadline, status, _id });
});

module.exports = router;
