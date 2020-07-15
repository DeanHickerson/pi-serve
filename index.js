require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const os = require('os');
const cors = require('cors');
const PORT = process.env.PORT || 80;

const app = express();

app.use(cors());
app.use(express.static('public'));

// app.get('/', (req,res) => {
// 	res.send();
// });

app.use(function (req, res, next) {
	res.status(404).send("404 - Sorry can't find that!🙅🏻");
});

app.listen(PORT, () => {
	console.log(`Server is running at http://${os.hostname()}:${PORT}`)
});