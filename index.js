#!/usr/bin/env node
// The line above allows us to setup as a service on linux
require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const os = require('os');
const cors = require('cors');
const PORT = process.env.PORT || 80;

const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.post('/api', (req,res) => {
	console.log(req.body);
	req.body.serve = 'we got it!';
	res.send(req.body);
});

// send something like /api?name=dean
app.get('/api', (req,res) => {
	if(req.query) {
		console.log(req.query);
		if(req.query.name) {
			res.send(req.query.name);
			return
		}
	}
	console.log('We got a request!');
	res.send({response:'No data available yet'});
});

app.use(function (req, res, next) {
	res.status(404).send("404 - Sorry can't find that!🙅🏻");
});

app.listen(PORT, () => {
	console.log(`Server is running at http://${os.hostname()}:${PORT}`)
});