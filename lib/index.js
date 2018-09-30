const port = process.env.PORT || 4000;
const express = require('express');
const app = express();
const axios = require('axios');

//app.use(cors());
//app.use(morgan('tiny'));

app.get('/', (req, res) => res.status(404).end());

app.get('/welcome', (req, res) => {
      //return res.json({"name": "nathan"});
      return res.send("Hello. My name is JARVIS");
});

app.get('/nasa', (req, res) => {
      const url = 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY'
      axios.get(url).then(response=>res.send(response.data.url));
});

app.get('/read/:endpoint/', async (req, res) => {
      console.log(`> request endpoint ${endpoint}`);
      const requestIp = req.headers['x-forwarded-for'];
      const allowedIps = ['203.111.27.70', '122.106.16.97', '58.108.165.238'];
      if (requestIp && allowedIps.indexOf(requestIp) === -1) return res.status(403).end();
      const { type, endpoint } = req.params;
      if (!type || !endpoint) return res.status(404).end();
      if (type === 'local') return res.json(await readFromFile(endpoint));
      if (type === 'remote') return res.json(await readFromS3(endpoint));
      return res.status(404).end();
});

app.listen(4000, () => {
      console.log(`JARVIS-API listening on port 4000.`);
});