const axios = require('axios');

import saveToS3 from '../utils/saveToS3';
import saveToFile from '../utils/saveToFile';


const dribbble = async (req, res) => {

      const access_token = process.env.DRIBBBLE_ACCESS_TOKEN;
      
      const url = "https://api.dribbble.com/v2/user/shots?access_token=" + access_token;

      const data = await axios(url).then(json => json.data);

      const json = []

      data.forEach(shot => {

            let desc = shot.description.replace('<p>','').replace('</p>','');

            json.push({
                  description: desc,
                  image: shot.images.normal,
                  link: shot.html_url,
            })
      });

      if (process.env.SAVE_OFFLINE === 'true') saveToFile('dribbble', json);
      if (process.env.SAVE_ONLINE === 'true') saveToS3('dribbble', json);
      if (res) res.json(json);
      return true;
};

export default dribbble;