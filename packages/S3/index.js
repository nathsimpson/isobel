const AWS = require("aws-sdk");

const s3 = new AWS.S3({ signatureVersion: "v4" });

exports.save = async (endpoint, data) =>
  new Promise((resolve, reject) => {
    s3.putObject(
      {
        Bucket: "jrvs-cache",
        Key: `cache/${endpoint}.json`,
        Body: JSON.stringify(data)
      },
      err => {
        if (err) {
          console.log("> error saving to s3", err);
          return reject();
        }
        console.log(`> saved ${endpoint} to s3`);
        return resolve();
      }
    );
  });

exports.read = async endpoint =>
  new Promise((resolve, reject) => {
    s3.getObject(
      {
        Bucket: "jrvs-cache",
        Key: `cache/${endpoint}.json`
      },
      (err, res) => {
        if (err) {
          console.log("> error retrieving to s3", err);
          return reject();
        }
        return resolve(JSON.parse(res.Body));
      }
    );
  });
