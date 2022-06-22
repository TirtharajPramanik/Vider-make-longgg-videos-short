import { spawn } from 'child_process';
import { appendFileSync, rmSync } from 'fs';
import express from 'express';
import { resolve } from 'path';

const root_path = resolve(__dirname, '../');
const this_path = `${root_path}webIface/`;
const py_path = `${root_path}vidEdit/`;
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('static'));

app.get('/', (req, res) => {
	res.render('index');
});

app.get('/upload', (req, res) => {
	res.render('index');
});

app.post('/upload', async (req, res) => {
	const fileName = req.query.fileName?.toString();
	req.on('data', (chunk) => {
		appendFileSync(`${this_path}uploads/${fileName}`, chunk); // append to a file on the disk
	});
	res.end();
});

app.get('/download', (req, res) => {
	const fileName = req.query.fileName?.toString();
	const fileDir = fileName?.substring(0, fileName.lastIndexOf('.')) || fileName;

	const execpy = spawn(`${py_path}venv/bin/python3`, [
		py_path,
		`./uploads/${fileName}`,
		`./${fileDir}`,
	]);

	execpy.stdout.on('data', () => console.log('sending data...'));
	execpy.on('close', (code) => {
		console.log('programme finished!' + code);
		res.sendFile(`${this_path}${fileDir}.tar.gz`);
		setTimeout(() => {
			rmSync(`./uploads/${fileName}`);
			rmSync(`./${fileDir}.tar.gz`);
		}, 3000);
	});
});

app.listen('3000', () => console.log('Server Running...'));
