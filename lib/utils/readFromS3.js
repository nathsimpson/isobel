import AWS from 'aws-sdk';

const s3 = new AWS.S3({ signatureVersion: 'v4' });

const readFromS3 = async endpoint => new Promise((resolve, reject) => {
  s3.getObject({
    Bucket: 'jrvs-cache',
    Key: `cache/${endpoint}.json`,
  }, (err, res) => {
    if (err) {
      console.log('> error retrieving to s3', err);
      return reject();
    }
    // console.log('> retrieved from s3');
    return resolve(JSON.parse(res.Body));
  });
});

export default readFromS3;