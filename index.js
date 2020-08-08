import express from "express";
import gradesRouter from "./routes/grades.js";
import {promises as fs} from "fs";

const {writeFile, readFile} = fs;

const app = express();
app.use(express.json());
app.use('/grades', gradesRouter);

global.fileName = "grades.json";

app.listen(3000, async () => {
    console.log('API started!');
});
