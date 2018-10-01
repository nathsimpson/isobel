const axios = require('axios');

//import saveToS3 from '../utils/saveToS3';
import saveToFile from '../utils/saveToFile';

const nasa = async (req, res) => {
      console.log('> requesting nasa');
      const url = 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY';
      const photo = await axios(url).then(json => json.data.url);

      const json = {
            "photo" : photo
      }

      if (process.env.SAVE_OFFLINE === 'true') saveToFile('nasa', json);
      //if (process.env.SAVE_ONLINE === 'true') saveToS3('calendar', results);
      if (res) res.json(json);
      return true;
};

export default nasa;