const axios = require('axios');

const saveToFile = require('../utils/saveToFile');
//import saveToS3 from '../utils/saveToS3';

const nasa = async (req, res) => {
      console.log('> requesting calendar');
      const url = 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY'
      const image = axios.get(url).then(response => res.send(response.data.url));

      let result = { 'photo': image };

      //if (process.env.SAVE_OFFLINE === 'true') saveToFile('calendar', results);
      //if (process.env.SAVE_ONLINE === 'true') saveToS3('calendar', results);
      saveToFile('nasa', result);
      if (res) res.json(result);
      return true;
};

export default nasa;