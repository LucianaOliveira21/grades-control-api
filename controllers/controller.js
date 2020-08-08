import {promises as fs} from "fs";

const {readFile, writeFile} = fs;

class Controller {
    async store(req, res) {
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
    }

    async update(req, res) {
        let grade = req.body;

        console.log(req)
        const today = new Date();

        if (!grade.student || !grade.subject || !grade.type || !grade.value) {
            throw new Error("Os campos student, subject, type e value são obrigatórios");
        }

        const data = JSON.parse(await readFile(global.fileName));

        const index = data.grades.findIndex(a => a.id === parseInt(req.params.id));

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
    }

    async delete(req, res) {
        const data  = JSON.parse(await readFile(global.fileName));

        const grade = data.grades.find(grade => grade.id === parseInt(req.params.id));

        if (!grade) {
            throw new Error("Registro não encontrado.");
        }

        data.grades = data.grades.filter(grade => grade.id !== parseInt(req.params.id));

        await writeFile(global.fileName, JSON.stringify(data, null, 2));
        res.end();
    }

    async show (req, res) {
        const data  = JSON.parse(await readFile(global.fileName));
        const grade = data.grades.find(grade => grade.id === parseInt(req.params.id));

        if (!grade) {
            throw new Error("Registro não encontrado.");
        }

        delete grade.nextId;
        res.send(grade);
    }

    async total (req, res) {
        const { student, subject } = req.body;

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
    }

    async avg (req, res) {
        const { subject, type } = req.body;

        if (!subject || !type) {
            throw new Error("Subject e type não podem ser vazios");
        }

        const data  = JSON.parse(await readFile(global.fileName));

        const items =  data.grades.filter(grade => grade.subject == subject && grade.type == type);

        if (items.length === 0) {
            return res.send("Nenhum resultado encontrado.");
        }

        const avg = items.reduce((acc, curr) => {
            return acc + curr.value
        }, 0)/items.length;

        res.send(`A média é ${avg}`);
    }

    async bestGrades (req, res) {
        const { subject, type } = req.body;

        if (!subject || !type) {
            throw new Error("Subject e type não podem ser vazios");
        }

        const data  = JSON.parse(await readFile(global.fileName));

        const items =  data.grades.filter(grade => grade.subject == subject && grade.type == type);

        if (items.length === 0) {
            return res.send("Nenhum resultado encontrado.");
        }

        items.sort((a, b) => b.value - a.value);

        res.send(items.slice(0,3));
    }

    async getAll (req, res) {
        const data = JSON.parse(await readFile(global.fileName));
        delete data.nextId;
        res.send(data);
    }
}

export default Controller;
