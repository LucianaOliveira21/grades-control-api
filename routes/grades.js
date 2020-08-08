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

        grade = {
            id: data.nextId++,
            student: grade.student,
            subject: grade.subject,
            type: grade.type,
            value: grade.value,
            timestamp: today
        };

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

router.delete("/:id", async (req, res) => {
    try {
        const data  = JSON.parse(await readFile(global.fileName));
        data.grades = data.grades.filter(grade => grade.id !== parseInt(req.params.id));

        const grade = data.grades.find(grade => grade.id === parseInt(id));

        if (!grade) {
            throw new Error("Registro não encontrado.");
        }

        await writeFile(global.fileName, JSON.stringify(data, null, 2));
        res.end();
    } catch (err) {
        res.status(400).send({error: err.message});
    }
});

router.get("/:id", async (req, res) => {
    try {
        const data  = JSON.parse(await readFile(global.fileName));
        const grade = data.grades.find(grade => grade.id === parseInt(req.params.id));

        if (!grade) {
            throw new Error("Registro não encontrado.");
        }

        delete grade.nextId;
        res.send(grade);
    } catch (err) {
        res.status(400).send({error: err.message});
    }
});

router.get("/total/:student/:subject", async (req, res) => {
   try {
       const { student, subject } = req.params;

       if (!student || !subject) {
           throw new Error("Student e subject não podem ser vazios");
       }

       const data  = JSON.parse(await readFile(global.fileName));

       const items =  data.grades.filter(grade => grade.student == student && grade.subject == subject);

       if (items.length === 0) {
           return res.send("Nenhum resultado encontrado.");
       }

       const sum = items.reduce((acc, curr) => {
           return acc + curr.value
       }, 0);

       res.send(`A soma das notas do aluno é ${sum}`);
   } catch (err) {
       res.status(400).send({error: err.message});
   }
});

router.get("/avg/:subject/:type", async (req, res) => {
    try {
        const { subject, type } = req.params;

        if (!subject || !type) {
            throw new Error("Subject e type não podem ser vazios");
        }

        const data  = JSON.parse(await readFile(global.fileName));

        const items =  data.grades.filter(grade => grade.subject == subject && grade.type == type);

        const avg = items.reduce((acc, curr) => {
            return acc + curr.value
        }, 0)/items.length;

        res.send(`A média é ${avg}`);
    } catch (err) {
        res.status(400).send({error: err.message});
    }
});

export default router;
