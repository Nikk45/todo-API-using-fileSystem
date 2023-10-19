const express = require('express');  
const fs = require('fs');       // for file System package

const app = express();          // instance of express
app.use(express.json());        // converts the http data into json data

const PORT = 8002;

// POST - Create Todo API
app.post('/add-todo',(req,res)=>{
    try{
        const newTodo = {
            id: req.body.id,
            title: req.body.title,
            data: new Date(),
            isCompleted: req.body.isCompleted
        }

        // converting the file data from string buffer to string and then Object
        const todoObj = JSON.parse(fs.readFileSync('./database.json').toString());

        todoObj.todos.push(newTodo);

        fs.writeFileSync('./database.json',JSON.stringify(todoObj));

        res.status(201).send({
            status: 201,
            message: 'todo created successfully'
        })
    }
    catch(err){
        res.status(400).send({
            status: 400,
            message: 'todo creation failed',
        })
    }
})

// GET - get all todos
app.get('/todos',(req,res)=>{
    try {
        const todoData = JSON.parse(fs.readFileSync('./database.json').toString());

        res.status(200).send({
            status: 200,
            message: "Fetched todos successfully",
            data: todoData,
        })
    } catch (err) {
        res.status(400).send({
            status:400,
            message: "Failed to get all todos",
            data: err
        })
    }
})

// GET - get todo by ID
app.get('/todo/:id',(req,res)=>{
    try {
        const todoID = Number(req.params.id);

        const fileData = JSON.parse(fs.readFileSync('./database.json').toString()); 

        const todoData = fileData.todos.filter((todo)=> todo.id === todoID);

        res.status(200).send({
            status: 200,
            message: "todo fetched by id successfully",
            data: todoData
        })
    } catch (err) {
        res.status(400).send({
            status:400,
            message: "Failed to get todo by id",
            data: err
        })
    }
})

// PUT - Updating a todo by id
app.put('/update-todo',(req,res)=>{
    try {
        const todoId = req.body.id;
        const todoTitle = req.body.title;
        const todoIsCompleted = req.body.isCompleted;

        const fileData = JSON.parse(fs.readFileSync('./database.json').toString());

        fileData.todos.forEach((todo)=>{
            if(todoId == todo.id){
                todo.title = todoTitle;
                todo.isCompleted = todoIsCompleted;
            }
        })

        fs.writeFileSync("./database.json", JSON.stringify(fileData));

        res.status(200).send({
            status: 200,
            message: "Todo is successfully updated!",
            data: fileData
        });

    } catch (err) {
        res.status(400).send({
            status: 400,
            message: "failed to update todo"
        })
    }
})


//  Delete - delete a todo
app.delete('/delete-todo/:id',(req,res)=>{
    try {
        const todoID = Number(req.params.id);

        const fileData = JSON.parse(fs.readFileSync('./database.json').toString());
        const filteredTodo = fileData.todos.filter((todo)=>todo.id!==todoID)

        fileData.todos = filteredTodo

        fs.writeFileSync('./database.json',JSON.stringify(fileData))

        res.status(200).send({
            status: 200,
            message: 'Todo deleted successfully',
        })
    } catch (err) {
        res.status(400).send({
            status: 400,
            message: 'Failed to delete todo',
        })
    }
})


app.listen(PORT, ()=>{
    console.log("server running at port: ", PORT)
})
