import AWS from 'aws-sdk';

const s3 = new AWS.S3({ signatureVersion: 'v4' });

const saveToS3 = async (endpoint, data) => new Promise((resolve, reject) => {
  s3.putObject({
    Bucket: 'jrvs-cache',
    Key: `cache/${endpoint}.json`,
    Body: JSON.stringify(data),
  }, (err) => {
    if (err) {
      console.log('> error saving to s3', err);
      return reject();
    }
    // console.log('> saved to s3');
    return resolve();
  });
});

export default saveToS3;