import express from "express";
import {promises as fs} from "fs";

const {readFile, writeFile} = fs;

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        let grade = req.body;
        const today = new Date();

        if (!grade.student || !grade.subject || !grade.type || !grade.value) {
            throw new Error("Os campos student, subject, type e value são obrigatórios");
        }

        const data = JSON.parse(await readFile(global.fileName));

        grade = {id: data.nextId++, student: grade.student, subject: grade.subject, type: grade.type, value: grade.value, timestamp: today};

        data.grades.push(grade);

        await writeFile(global.fileName, JSON.stringify(data, null, 2));

        res.send(data);
    } catch (err) {
        res.status(400).send({error: err.message});
    }
});

router.put("/", async (req, res) => {
   try {
       let grade = req.body;
       const today = new Date();

       if (!grade.student || !grade.subject || !grade.type || !grade.value) {
           throw new Error("Os campos student, subject, type e value são obrigatórios");
       }

       const data = JSON.parse(await readFile(global.fileName));

       const index = data.grades.findIndex(a => a.id === parseInt(grade.id));

       if (index === -1) {
           throw new Error("Registro não encontrado.");
       }

       data.grades[index].student   = grade.student;
       data.grades[index].subject   = grade.subject;
       data.grades[index].type      = grade.type;
       data.grades[index].value     = grade.value;
       data.grades[index].timestamp = today;

       await writeFile(global.fileName, JSON.stringify(data, null, 2));

       res.send(grade);
   } catch (err) {
       res.status(400).send({error: err.message});
   }
});

router.get("/", async (req, res) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        delete data.nextId;
        res.send(data);
    } catch (err) {
        console.log(err);
    }
});

export default router;
